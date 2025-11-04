import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProductService } from './services/product.service';
import { ProductCardComponent } from './components/product-card/product-card.component';

@Component({
	selector: 'app-dashboard-page',
	imports: [AsyncPipe, ProductCardComponent],
	templateUrl: './dashboard-page.component.html',
	styleUrl: './dashboard-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
	private readonly productService = inject(ProductService);

	products$ = this.productService.getProducts();
}
