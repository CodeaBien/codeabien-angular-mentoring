import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth-api.model';

@Injectable({
	providedIn: 'root',
})
export class AuthApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = environment.apiUrl;

	login(payload: LoginRequest): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
	}
}
