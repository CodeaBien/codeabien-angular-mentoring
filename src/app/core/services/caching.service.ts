import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface CacheEntry {
	response: HttpResponse<unknown>;
	expiry: number;
}

@Injectable({
	providedIn: 'root',
})
export class CachingService {
	private readonly cache = new Map<string, CacheEntry>();
	//El guion bajo _ en números como 300_000 es un separador numérico que mejora la legibilidad sin alterar su valor. 300_000 es exactamente igual que 300000; solo facilita leer cifras grandes. En el ejemplo, 300_000 representa milisegundos (5 minutos) como tiempo de vida por defecto en caché.
	private readonly DEFAULT_TTL = 100_000; // 5 minutos

	get(key: string): HttpResponse<unknown> | null {
		const entry = this.cache.get(key);
		if (!entry) {
			return null;
		}

		const isExpired = Date.now() > entry.expiry;
		if (isExpired) {
			this.cache.delete(key);
			return null;
		}

		return entry.response;
	}

	put(key: string, response: HttpResponse<unknown>): void {
		const expiry = Date.now() + this.DEFAULT_TTL;
		this.cache.set(key, { response, expiry });
	}

	clear(): void {
		this.cache.clear();
	}
}
