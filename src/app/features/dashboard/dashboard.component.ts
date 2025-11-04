import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@/features/auth/domain/store/auth.store';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	template: `
		<div class="dashboard">
			<h1>Welcome to the Dashboard!</h1>
			<p>This is a protected area.</p>
			<button (click)="logout()">Logout</button>
		</div>
	`,
	styles: [
		`
			.dashboard {
				padding: 2rem;
				text-align: center;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
	// Dashboard component - testing lefthook
	constructor(
		private authStore: AuthStore,
		private router: Router
	) {}

	logout(): void {
		this.authStore.logout();
		this.router.navigate(['/auth/login']);
	}
}
