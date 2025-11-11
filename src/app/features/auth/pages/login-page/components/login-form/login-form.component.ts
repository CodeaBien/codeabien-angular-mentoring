import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '@/features/auth/domain/models/auth-api.model';
import { DemoInput } from '@/features/auth/pages/login-page/components/demo-input/demo-input';

@Component({
	selector: 'app-login-form',
	standalone: true,
	imports: [ReactiveFormsModule, DemoInput],
	templateUrl: './login-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
	isLoading = input<boolean>(false);
	error = input<string | null>(null);
	name = input<string>('John Doe');

	// private readonly formBuilder = inject(FormBuilder);
	private readonly formBuilder = inject(FormBuilder);

	@Output() login = new EventEmitter<LoginRequest>();

	// form = new FormGroup({
	// 	username: new FormControl('mor_2314', [Validators.required]),
	// 	password: new FormControl('83r5^_', [Validators.required, Validators.minLength(6)]),
	// 	rememberMe: new FormGroup({
	// 		checkbox: new FormControl(''),
	// 		datetime: new FormControl(''),
	// 	}),
	// });

	form = this.formBuilder.group(
		{
			username: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			namedemo: ['', [Validators.required]],
			rememberMe: this.formBuilder.group({
				checkbox: [''],
				datetime: [''],
			}),
		},
		{ validators: [Validators.required] }
	);

	ngOnInit(): void {
		this.form.controls.namedemo.valueChanges.subscribe((value) => {});
	}

	onSubmit(): void {
		console.log(this.form.errors);
		console.log(this.form.controls.username.errors);
		if (this.form.valid) {
			this.login.emit(this.form.value as LoginRequest);
		}
	}

	inputChange(value: string): void {
		console.log(value);
	}
}
