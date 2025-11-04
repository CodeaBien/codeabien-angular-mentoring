import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartItem } from '../../../../domain/models/cart.model';

@Component({
	selector: 'app-cart-list',
	imports: [NgOptimizedImage, DecimalPipe],
	templateUrl: './cart-list.component.html',
	styleUrl: './cart-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartListComponent {
	items = input.required<CartItem[]>();
	total = input.required<number>();

	// nuevo
	updateQuantity = output<{ productId: number; quantity: number }>();
	removeProduct = output<number>();

	//con decoradores
	// @Output() updateQuantity = new EventEmitter<{
	//   productId: number;
	//   quantity: number;
	// }>();
	// @Output() removeProduct = new EventEmitter<number>();

	onQuantityChange(productId: number, event: Event): void {
		const input = event.target as HTMLInputElement;
		const quantity = parseInt(input.value, 10);
		if (!Number.isNaN(quantity) && quantity >= 0) {
			this.updateQuantity.emit({ productId, quantity });
		}
	}

	onRemove(productId: number): void {
		this.removeProduct.emit(productId);
	}
}
