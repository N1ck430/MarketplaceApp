import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpValidationProblemDetails, IRegisterRequest, RegisterRequest, UserClient } from 'app/api/api-client-generated';
import { CHeaderComponent } from 'app/components/c-header/c-header.component';
import { CInputComponent } from 'app/components/input/c-input/c-input.component';
import { Helper } from 'app/helpers/Helper';
import { SharedModule } from 'app/helpers/shared.module';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';

@Component({
    standalone: true,
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [CInputComponent, CHeaderComponent, ReactiveFormsModule, RouterModule, SharedModule],
    providers: [UserClient, LoaderService],
})
export class RegisterComponent implements OnInit {
    formGroup: FormGroup<{
        [Property in keyof IRegisterRequest]: FormControl<IRegisterRequest[Property]>;
    }>;
    constructor(
        private _userClient: UserClient,
        private _log: LogService,
        private _router: Router,
        private _loaderService: LoaderService,
    ) {
        this.formGroup = Helper.apiModelToFormGroup<IRegisterRequest>(RegisterRequest);
        this.formGroup.get('username')?.setValidators(Validators.required);
        this.formGroup.get('email')?.setValidators([Validators.required, Validators.email]);
        this.formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        (this.formGroup as FormGroup).addControl(
            'confirmPassword',
            new FormControl('', [Validators.required, Validators.minLength(8), this.matchValues('password')]),
        );
    }

    ngOnInit() {}

    async register(value) {
        await this._loaderService.show();
        this._userClient.register(value as RegisterRequest).subscribe({
            next: async (response) => {
                await this._log.toastInfo('USER.CONFIRM_EMAIL_HINT');
                await this._router.navigateByUrl('/user/login');
                await this._loaderService.dismiss();
            },
            error: async (err: HttpValidationProblemDetails) => {
                await this._log.toastError(err.errors === undefined ? 'GENERAL.ERROR' : Object.values(err.errors).join('\n'));
                console.error(err);
                await this._loaderService.dismiss();
            },
        });
    }

    private matchValues(controlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return control.value === control.parent?.get(controlName)?.value ? null : { isMatch: false };
        };
    }
}
