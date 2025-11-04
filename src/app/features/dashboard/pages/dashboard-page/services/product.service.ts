import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { ProductApiService } from '../../../domain/services/product-api.service';
import type { ProductVm } from '../models/product.vm';

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private readonly productApiService = inject(ProductApiService);

	getProducts(): Observable<ProductVm[]> {
		return this.productApiService.getProducts().pipe(
			map((products) =>
				products.map((product) => ({
					...product,
					isEdit: false,
				}))
			)
		);
	}
}
