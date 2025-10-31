import { LoginRequest } from '@/features/auth/domain/models/auth-api.model';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginPageService } from './services/login-page.service';

@Component({
	selector: 'app-login-page',
	standalone: true,
	imports: [LoginFormComponent],
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss'],
	providers: [LoginPageService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
	protected readonly pageService = inject(LoginPageService);
	name = 'John Doe';

	onLogin(payload: LoginRequest): void {
		this.pageService.login(payload);
	}

	onRegister(): string {
		console.log('register');
		return 'register';
	}
}
