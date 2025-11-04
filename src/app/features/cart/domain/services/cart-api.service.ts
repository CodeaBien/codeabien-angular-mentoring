import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { CartApiResponse, CreateCartRequest } from '../models/cart-api.model';

@Injectable({
	providedIn: 'root',
})
export class CartApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = environment.apiUrl;

	getUserCart(userId: number): Observable<CartApiResponse[]> {
		return this.http.get<CartApiResponse[]>(`${this.baseUrl}/carts/user/${userId}`);
	}

	addCart(cart: CreateCartRequest): Observable<CartApiResponse> {
		return this.http.post<CartApiResponse>(`${this.baseUrl}/carts`, cart);
	}

	updateCart(cartId: number, cart: CreateCartRequest): Observable<CartApiResponse> {
		return this.http.put<CartApiResponse>(`${this.baseUrl}/carts/${cartId}`, cart);
	}
}
