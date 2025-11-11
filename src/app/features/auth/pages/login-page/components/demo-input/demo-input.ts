import { Component, forwardRef, OnInit, ViewEncapsulation } from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	ValidationErrors,
	Validator,
} from '@angular/forms';

@Component({
	selector: 'app-demo-input',
	imports: [ReactiveFormsModule],
	templateUrl: './demo-input.html',
	styleUrl: './demo-input.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DemoInput),
			multi: true,
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => DemoInput),
			multi: true,
		},
	],
	encapsulation: ViewEncapsulation.ShadowDom,
})
export class DemoInput implements ControlValueAccessor, OnInit, Validator {
	// name = input<string>('');
	// inputChange = output<string>();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	_onChange: (value: string) => void = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	_onTouched: () => void = () => {};

	form = new FormGroup({
		namedemo: new FormControl(''),
	});

	ngOnInit(): void {
		this.form.controls.namedemo.valueChanges.subscribe((value) => {
			this._onChange(value as string);
		});
	}

	writeValue(value: string): void {
		console.log('writeValue', value);
	}

	registerOnChange(fn: (value: string) => void): void {
		console.log('registerOnChange', fn);
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		console.log('registerOnTouched', fn);
		this._onTouched = fn;
	}

	validate(control: AbstractControl): ValidationErrors | null {
		console.log('validate', control);
		return null;
	}

	registerOnValidatorChange(fn: () => void): void {
		console.log('registerOnValidatorChange', fn);
	}
}
