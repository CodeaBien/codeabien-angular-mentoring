import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ProductVm } from '../../models/product.vm';
import { NgOptimizedImage } from '@angular/common';
import { CartPageService } from '@/features/cart/pages/cart-page/services/cart-page.service';

@Component({
	selector: 'app-product-card',
	imports: [NgOptimizedImage],
	templateUrl: './product-card.component.html',
	styleUrl: './product-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
	product = input.required<ProductVm>();
	private readonly cartPageService = inject(CartPageService);

	private readonly _isAddingToCart = signal(false);
	readonly isAddingToCart = this._isAddingToCart.asReadonly();

	addToCart(): void {
		const product = this.product();
		if (this._isAddingToCart()) return;

		this._isAddingToCart.set(true);

		// Usar userId 1 por defecto (fakestoreapi no tiene autenticación real)
		// Pasar los detalles completos del producto para actualización optimista
		this.cartPageService.addProductToCart(1, product.id, 1, product.title, product.price, product.image);

		// Resetear el estado después de un pequeño delay para mostrar feedback visual
		setTimeout(() => {
			this._isAddingToCart.set(false);
		}, 500);
	}
}
