import { LoginRequest } from '@/features/auth/domain/models/auth-api.model';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';
import {
	AbstractControl,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';

const _customValidators = (control: AbstractControl): ValidationErrors | null => {
	const value = control.value as string;
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(control.parent?.parent?.get('username')?.value);
	return value.length > 3 ? null : { validatorAlvaro: true };
};

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

	private readonly fb = inject(NonNullableFormBuilder);

	@Output() login = new EventEmitter<LoginRequest>();

	form = this.fb.group({
		username: ['mor_2314', [Validators.required]],
		password: ['83r5^_', [Validators.required, Validators.minLength(6)]],
		newGroup: this.fb.group({
			message: this.fb.control('', [Validators.required, _customValidators]),
		}),
	});

	onSubmit(): void {
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(this.form.controls.username.errors);
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(this.form.controls.newGroup.controls.message.errors);

		// if (this.form.valid) {
		// 	this.login.emit(this.form.value as LoginRequest);
		// }
	}
}
