import { computed, Injectable, signal } from '@angular/core';
import type { Cart, CartItem } from '../models/cart.model';

@Injectable({
	providedIn: 'root',
})
export class CartStore {
	// Estado privado
	private readonly _cart = signal<Cart | null>(null);
	private readonly _loading = signal<boolean>(false);

	// Selectores públicos (read-only)
	readonly cart = this._cart.asReadonly();
	readonly loading = this._loading.asReadonly();

	// Computed signals
	readonly itemCount = computed(() => this._cart()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);

	readonly total = computed(() => this._cart()?.items.reduce((sum, item) => sum + item.subtotal, 0) ?? 0);

	// Mutaciones
	setCart(cart: Cart | null): void {
		this._cart.set(cart);
	}

	setLoading(loading: boolean): void {
		this._loading.set(loading);
	}

	addItem(item: CartItem): void {
		const currentCart = this._cart();
		if (currentCart) {
			const existingItem = currentCart.items.find((i) => i.productId === item.productId);
			if (existingItem) {
				existingItem.quantity += item.quantity;
				existingItem.subtotal = existingItem.price * existingItem.quantity;
			} else {
				currentCart.items.push(item);
			}
			this._cart.set({ ...currentCart });
		}
	}

	updateQuantity(productId: number, quantity: number): void {
		const currentCart = this._cart();
		if (currentCart) {
			const item = currentCart.items.find((i) => i.productId === productId);
			if (item) {
				item.quantity = quantity;
				item.subtotal = item.price * quantity;
				this._cart.set({ ...currentCart });
			}
		}
	}

	removeItem(productId: number): void {
		const currentCart = this._cart();
		if (currentCart) {
			currentCart.items = currentCart.items.filter((i) => i.productId !== productId);
			this._cart.set({ ...currentCart });
		}
	}
}
