import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, tap, throwError } from 'rxjs';
import type { LoginRequest } from '../../../domain/models/auth-api.model';
import { AuthApiService } from '../../../domain/services/auth-api.service';
import { AuthStore } from '../../../domain/store/auth.store';

@Injectable()
export class LoginPageService {
	private readonly authService = inject(AuthApiService);
	private readonly authStore = inject(AuthStore);
	private readonly router = inject(Router);

	readonly isLoading = signal(false);
	readonly error = signal<string | null>(null);

	login(payload: LoginRequest): void {
		this.isLoading.set(true);
		this.error.set(null);

		this.authService
			.login(payload)
			.pipe(
				tap(({ token }) => {
					this.authStore.login(token);
					this.router.navigate(['/dashboard']);
				}),
				catchError((err) => {
					console.error('Login failed', err);
					this.error.set('Invalid credentials. Please try again.');
					return throwError(() => err);
				}),
				finalize(() => this.isLoading.set(false))
			)
			.subscribe();
	}
}
