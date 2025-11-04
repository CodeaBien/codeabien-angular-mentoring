import { computed, Injectable, inject, signal } from '@angular/core';
import { SessionService } from '../../../../core/services/session.service';

@Injectable({
	providedIn: 'root',
})
export class AuthStore {
	private readonly sessionService = inject(SessionService);

	// Private state signals
	private readonly _token = signal<string | null>(this.sessionService.getToken());

	// Public computed signals
	readonly isAuthenticated = computed(() => !!this._token());
	readonly token = computed(() => this._token());

	// Methods to update state
	login(token: string): void {
		this.sessionService.setToken(token);
		this._token.set(token);
	}

	logout(): void {
		this.sessionService.clear();
		this._token.set(null);
	}

	/**
	 * Returns the authorization header value.
	 * @returns The `Authorization` header or `null` if not authenticated.
	 */
	getAuthHeader(): string | null {
		const token = this._token();
		if (!token) {
			return null;
		}
		return `Bearer ${token}`;
	}
}
