import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartStore } from '@/features/cart/domain/store/cart.store';
import { AuthStore } from '@/features/auth/domain/store/auth.store';
import { CartPageService } from '@/features/cart/pages/cart-page/services/cart-page.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
	private readonly router = inject(Router);
	private readonly authStore = inject(AuthStore);
	private readonly cartStore = inject(CartStore);
	private readonly cartPageService = inject(CartPageService);

	// Signals
	readonly isAuthenticated = this.authStore.isAuthenticated;
	readonly itemCount = this.cartStore.itemCount;

	constructor() {
		// Cargar el carrito cuando el usuario esté autenticado
		effect(() => {
			if (this.isAuthenticated()) {
				// Solo cargar si el carrito está vacío (no cargado previamente)
				const currentCart = this.cartStore.cart();
				if (!currentCart && !this.cartStore.loading()) {
					// Usar userId 1 por defecto (fakestoreapi no tiene autenticación real)
					this.cartPageService.loadUserCart(1);
				}
			}
		});
	}

	navigateToCart(): void {
		this.router.navigate(['/cart']);
	}

	navigateToDashboard(): void {
		this.router.navigate(['/dashboard']);
	}

	isRouteActive(path: string): boolean {
		return this.router.url === path;
	}

	logout(): void {
		this.authStore.logout();
		this.router.navigate(['/auth/login']);
	}
}
