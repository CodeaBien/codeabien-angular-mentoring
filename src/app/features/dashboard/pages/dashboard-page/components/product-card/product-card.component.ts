import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductVm } from '../../models/product.vm';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  product = input.required<ProductVm>();
}
