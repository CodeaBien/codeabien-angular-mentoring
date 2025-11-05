import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStore } from "@/features/auth/domain/store/auth.store";
import { LoginRequest } from "../auth/domain/models/auth-api.model";
@Component({
	selector: "app-dashboard",
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
	private readonly authStore = inject(AuthStore);
	private readonly router = inject(Router);

	demo: LoginRequest = {
		username: "mor_2314",
		password: "83r5^_",
	};
	// test
	logout(): void {
		this.authStore.logout();
		this.router.navigate(["/auth/login"]);
	}
}
