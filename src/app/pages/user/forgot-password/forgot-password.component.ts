import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpValidationProblemDetails, ResetPasswordRequest, UserClient } from 'app/api/api-client-generated';
import { CHeaderComponent } from 'app/components/c-header/c-header.component';
import { CInputComponent } from 'app/components/input/c-input/c-input.component';
import { SharedModule } from 'app/helpers/shared.module';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';

@Component({
    standalone: true,
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [SharedModule, CHeaderComponent, CInputComponent, ReactiveFormsModule],
    providers: [UserClient, LoaderService, LogService],
})
export class ForgotPasswordComponent implements OnInit {
    emailForm: FormGroup | undefined;
    passwordForm: FormGroup | undefined;
    userId: string | null;
    code: string | null;

    constructor(
        private _userClient: UserClient,
        private _loaderService: LoaderService,
        private _logService: LogService,
        private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _router: Router,
    ) {
        this.userId = this._activatedRoute.snapshot.paramMap.get('userId');
        this.code = this._activatedRoute.snapshot.paramMap.get('code');

        if (this.userId === null || this.code == null) {
            this.emailForm = _fb.group({
                email: ['', [Validators.required, Validators.email]],
            });
            return;
        }

        this.passwordForm = _fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8), this.matchValues('password')]],
        });
    }

    ngOnInit() {}

    async sendResetEmail(value: { email: string }) {
        await this._loaderService.show();
        this._userClient.resetPassword(ResetPasswordRequest.fromJS({ email: value.email })).subscribe(async () => {
            await this._logService.toastInfo('USER.RESET_PASSWORD_MAIL_HINT');
            await this._loaderService.dismiss();
        });
    }

    async resetPassword(value: { password: string }) {
        await this._loaderService.show();
        this._userClient
            .resetPassword(
                ResetPasswordRequest.fromJS({
                    userId: this.userId,
                    resetCode: this.code,
                    password: value.password,
                }),
            )
            .subscribe({
                next: async () => {
                    await this._logService.toastSucces('USER.RESET_PASSWORD_SUCCESS');
                    await this._loaderService.dismiss();
                    await this._router.navigateByUrl('/user/login');
                },
                error: async (err: HttpValidationProblemDetails) => {
                    await this._logService.toastError(err.errors === undefined ? 'GENERAL.ERROR' : Object.values(err.errors).join('\n'));
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
