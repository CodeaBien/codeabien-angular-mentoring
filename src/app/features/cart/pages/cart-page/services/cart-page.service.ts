import { Injectable, inject } from '@angular/core';
import { map, type Observable, of, switchMap } from 'rxjs';
import type { ProductResponse } from '../../../../dashboard/domain/models/product-api.model';
import { ProductApiService } from '../../../../dashboard/domain/services/product-api.service';
import type { Cart, CartItem } from '../../../domain/models/cart.model';
import type { CartApiResponse } from '../../../domain/models/cart-api.model';
import { CartApiService } from '../../../domain/services/cart-api.service';
import { CartStore } from '../../../domain/store/cart.store';

@Injectable({
	providedIn: 'root',
})
export class CartPageService {
	private readonly cartApiService = inject(CartApiService);
	private readonly cartStore = inject(CartStore);
	private readonly productApiService = inject(ProductApiService);

	/**
	 * Carga el carrito del usuario y lo enriquece con datos de productos
	 * @param userId ID del usuario (por defecto 1 para fakestoreapi)
	 * @param forceReload Forzar recarga incluso si ya hay un carrito cargado
	 */
	loadUserCart(userId: number = 1, forceReload: boolean = false): void {
		// Evitar cargas duplicadas: si ya está cargando, no hacer nada (a menos que sea forzado)
		if (this.cartStore.loading() && !forceReload) {
			return;
		}

		// Solo recargar si no hay carrito cargado, si es otro usuario, o si se fuerza la recarga
		const currentCart = this.cartStore.cart();
		if (!forceReload && currentCart && currentCart.userId === userId) {
			// Ya hay un carrito cargado para este usuario, no recargar
			return;
		}

		this.cartStore.setLoading(true);

		this.cartApiService
			.getUserCart(userId)
			.pipe(
				switchMap((carts: CartApiResponse[]) => {
					if (!carts || carts.length === 0) {
						this.cartStore.setCart(null);
						return of(null);
					}

					// Ordenar carritos por fecha (más reciente primero)
					const sortedCarts = [...carts].sort((a, b) => {
						const dateA = new Date(a.date).getTime();
						const dateB = new Date(b.date).getTime();
						return dateB - dateA; // Orden descendente (más reciente primero)
					});

					// Tomar el carrito más reciente
					const latestCart = sortedCarts[0];

					// Enriquecer con datos de productos
					return this.enrichCartWithProducts(latestCart);
				})
			)
			.subscribe({
				next: (cart) => {
					this.cartStore.setCart(cart);
					this.cartStore.setLoading(false);
				},
				error: () => {
					this.cartStore.setLoading(false);
				},
			});
	}

	/**
	 * Enriquece el carrito con datos completos de productos
	 */
	private enrichCartWithProducts(cartApi: CartApiResponse): Observable<Cart | null> {
		if (!cartApi.products || cartApi.products.length === 0) {
			return of(null);
		}

		// Obtener todos los productos una sola vez y enriquecer el carrito
		return this.productApiService.getProducts().pipe(
			map((allProducts: ProductResponse[]) => {
				// Crear un mapa de productos para acceso rápido
				const productMap = new Map<number, ProductResponse>();
				allProducts.forEach((product) => {
					productMap.set(product.id, product);
				});

				// Construir los items del carrito enriquecidos
				const enrichedItems = cartApi.products.map((cartProduct) => {
					const product = productMap.get(cartProduct.productId);
					if (!product) {
						throw new Error(`Producto con ID ${cartProduct.productId} no encontrado`);
					}

					return {
						productId: product.id,
						title: product.title,
						price: product.price,
						image: product.image,
						quantity: cartProduct.quantity,
						subtotal: product.price * cartProduct.quantity,
					};
				});

				// Construir el carrito enriquecido
				return {
					id: cartApi.id,
					userId: cartApi.userId,
					date: new Date(cartApi.date),
					items: enrichedItems,
				};
			})
		);
	}

	/**
	 * Agrega un producto al carrito
	 */
	addProductToCart(
		userId: number,
		productId: number,
		quantity: number = 1,
		title?: string,
		price?: number,
		image?: string
	): void {
		const currentCart = this.cartStore.cart();
		const date = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

		if (currentCart) {
			// Actualización optimista: actualizar el store inmediatamente
			const existingProductIndex = currentCart.items.findIndex((item) => item.productId === productId);

			let updatedItems: CartItem[];

			if (existingProductIndex >= 0) {
				// El producto ya existe, incrementar cantidad
				updatedItems = currentCart.items.map((item, index) => {
					if (index === existingProductIndex) {
						return {
							...item,
							quantity: item.quantity + quantity,
							subtotal: item.price * (item.quantity + quantity),
						};
					}
					return item;
				});
			} else {
				// Es un producto nuevo, agregarlo
				if (!title || price === undefined || !image) {
					// Si no se proporcionan los detalles, agregar con valores temporales
					// y recargar desde la API después
					updatedItems = [
						...currentCart.items,
						{
							productId,
							title: '', // Se actualizará cuando se recargue
							price: 0,
							image: '',
							quantity,
							subtotal: 0,
						},
					];
				} else {
					// Agregar con los detalles completos del producto
					updatedItems = [
						...currentCart.items,
						{
							productId,
							title,
							price,
							image,
							quantity,
							subtotal: price * quantity,
						},
					];
				}
			}

			// Actualizar el carrito en el store inmediatamente
			const updatedCart: Cart = {
				...currentCart,
				items: updatedItems,
			};
			this.cartStore.setCart(updatedCart);

			// Preparar productos para la API
			const productsForApi = updatedItems.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
			}));

			this.cartApiService
				.updateCart(currentCart.id, {
					userId,
					date,
					products: productsForApi,
				})
				.subscribe({
					next: () => {
						// Recargar el carrito desde la API para asegurar sincronización
						this.cartStore.setLoading(false);
						this.loadUserCart(userId, true);
					},
					error: () => {
						// Si falla la API, revertir el cambio optimista
						this.cartStore.setCart(currentCart);
					},
				});
		} else {
			// Crear nuevo carrito
			// Primero actualizar el store con los datos disponibles (si se proporcionaron)
			if (title && price !== undefined && image) {
				const newCart: Cart = {
					id: 0, // Temporal, se actualizará después
					userId,
					date: new Date(),
					items: [
						{
							productId,
							title,
							price,
							image,
							quantity,
							subtotal: price * quantity,
						},
					],
				};
				this.cartStore.setCart(newCart);
			}

			this.cartApiService
				.addCart({
					userId,
					date,
					products: [{ productId, quantity }],
				})
				.subscribe({
					next: () => {
						// Recargar el carrito desde la API
						this.cartStore.setLoading(false);
						this.loadUserCart(userId, true);
					},
					error: () => {
						// Si falla la API, limpiar el carrito
						this.cartStore.setCart(null);
					},
				});
		}
	}

	/**
	 * Actualiza la cantidad de un producto en el carrito
	 */
	updateProductQuantity(userId: number, productId: number, quantity: number): void {
		const currentCart = this.cartStore.cart();
		if (!currentCart) return;

		const item = currentCart.items.find((i) => i.productId === productId);
		if (!item) return;

		// Actualización optimista: actualizar el store inmediatamente
		const updatedItems = currentCart.items.map((i) => {
			if (i.productId === productId) {
				return {
					...i,
					quantity: quantity,
					subtotal: i.price * quantity,
				};
			}
			return i;
		});

		// Actualizar el carrito en el store
		const updatedCart: Cart = {
			...currentCart,
			items: updatedItems,
		};
		this.cartStore.setCart(updatedCart);

		const date = new Date().toISOString().split('T')[0];
		const productsForApi = updatedItems.map((item) => ({
			productId: item.productId,
			quantity: item.quantity,
		}));

		this.cartApiService
			.updateCart(currentCart.id, {
				userId,
				date,
				products: productsForApi,
			})
			.subscribe({
				next: () => {
					// Recargar el carrito desde la API para asegurar sincronización
					this.cartStore.setLoading(false);
					this.loadUserCart(userId);
				},
				error: () => {
					// Si falla la API, revertir el cambio optimista
					this.cartStore.setCart(currentCart);
				},
			});
	}

	/**
	 * Elimina un producto del carrito
	 */
	removeProductFromCart(userId: number, productId: number): void {
		const currentCart = this.cartStore.cart();
		if (!currentCart) return;

		// Actualización optimista: actualizar el store inmediatamente
		const updatedItems = currentCart.items.filter((item) => item.productId !== productId);

		// Actualizar el carrito en el store con los items filtrados
		const updatedCart: Cart = {
			...currentCart,
			items: updatedItems,
		};
		this.cartStore.setCart(updatedCart);

		const date = new Date().toISOString().split('T')[0];
		const productsForApi = updatedItems.map((item) => ({
			productId: item.productId,
			quantity: item.quantity,
		}));

		this.cartApiService
			.updateCart(currentCart.id, {
				userId,
				date,
				products: productsForApi,
			})
			.subscribe({
				next: () => {
					// Recargar el carrito desde la API para asegurar sincronización
					// Forzar recarga para actualizar los datos
					this.cartStore.setLoading(false);
					this.loadUserCart(userId, true);
				},
				error: () => {
					// Si falla la API, revertir el cambio optimista
					this.cartStore.setCart(currentCart);
				},
			});
	}
}
