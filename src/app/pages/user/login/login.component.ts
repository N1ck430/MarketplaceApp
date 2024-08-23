import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ILoginRequest, LoginRequest, ProblemDetails, UserClient } from 'app/api/api-client-generated';
import { CHeaderComponent } from 'app/components/c-header/c-header.component';
import { CInputComponent } from 'app/components/input/c-input/c-input.component';
import { Helper } from 'app/helpers/Helper';
import { SharedModule } from 'app/helpers/shared.module';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';
import { UserService } from 'app/services/user.service';

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [SharedModule, RouterModule, ReactiveFormsModule, CInputComponent, CHeaderComponent],
    providers: [UserClient, LogService, LoaderService],
})
export class LoginComponent implements OnInit {
    @Output() forgotPasswordCallback: EventEmitter<any> = new EventEmitter();

    formGroup: FormGroup<{
        [Property in keyof ILoginRequest]: FormControl<ILoginRequest[Property]>;
    }>;
    constructor(
        private _userClient: UserClient,
        private _userService: UserService,
        private _log: LogService,
        private _loaderService: LoaderService,
    ) {
        this.formGroup = Helper.apiModelToFormGroup<ILoginRequest>(LoginRequest);
        this.formGroup.get('userName')?.setValidators(Validators.required);
        this.formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }

    ngOnInit() {}

    async login(value) {
        this._loaderService.show();
        this._userClient.login(value as LoginRequest).subscribe({
            next: async (response) => {
                await this._userService.login(response);
                await this._loaderService.dismiss();
            },
            error: async (err: ProblemDetails) => {
                this._log.toastError(
                    err.detail === undefined ? 'GENERAL.ERROR' : err.detail === 'Failed' ? 'USER.WRONG_USER_OR_PASSWORD' : 'USER.CONFIRM_EMAIL_HINT',
                );
                console.error(err);
                await this._loaderService.dismiss();
            },
        });
    }

    forgotPassword(event: Event) {
        event.preventDefault();
        this.forgotPasswordCallback.emit();
    }
}
