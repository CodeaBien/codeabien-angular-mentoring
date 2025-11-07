import { CachingService } from '@/core/services/caching.service';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
	// Solo cachear peticiones GET
	if (req.method !== 'GET') {
		return next(req);
	}

	const cachingService = inject(CachingService);
	const cachedResponse = cachingService.get(req.urlWithParams);

	if (cachedResponse) {
		// Retornar la respuesta cacheada como un observable
		return of(cachedResponse.clone());
	}

	return next(req).pipe(
		tap((event) => {
			// Cachear solo si es una respuesta HTTP completa
			if (event instanceof HttpResponse) {
				cachingService.put(req.urlWithParams, event.clone());
			}
		})
	);
};
