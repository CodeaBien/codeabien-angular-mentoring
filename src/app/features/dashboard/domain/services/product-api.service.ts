import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductResponse } from '../models/product-api.model';

@Injectable({
	providedIn: 'root',
})
export class ProductApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = environment.apiUrl;

	getProducts(): Observable<ProductResponse[]> {
		return this.http.get<ProductResponse[]>(`${this.baseUrl}/products`);
	}
}
