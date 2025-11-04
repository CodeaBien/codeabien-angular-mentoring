import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '@/features/auth/domain/store/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authStore = inject(AuthStore);
	const authToken = authStore.token();

	let authReq = req;
	if (authToken) {
		authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${authToken}`,
			},
		});
	}

	return next(authReq).pipe(
		catchError((error) => {
			if (error.status === 401) {
				authStore.logout();
				console.warn('Unauthorized request. User logged out.');
			}
			return throwError(() => error);
		})
	);
};
