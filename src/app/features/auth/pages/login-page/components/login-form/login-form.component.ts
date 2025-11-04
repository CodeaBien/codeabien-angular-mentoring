import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '@/features/auth/domain/models/auth-api.model';

@Component({
	selector: 'app-login-form',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './login-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
	isLoading = input<boolean>(false);
	error = input<string | null>(null);

	@Output() login = new EventEmitter<LoginRequest>();

	form = new FormBuilder().group({
		username: ['mor_2314', [Validators.required]],
		password: ['83r5^_', [Validators.required, Validators.minLength(6)]],
	});

	onSubmit(): void {
		if (this.form.valid) {
			this.login.emit(this.form.value as LoginRequest);
		}
	}
}
