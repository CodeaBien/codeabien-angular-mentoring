import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly TOKEN_KEY = 'auth_token';

  readonly token$ = signal<string | null>(this.getToken());

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token$.set(token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.token$.set(null);
  }
}
