import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmailRequest, UserClient } from 'app/api/api-client-generated';
import { SharedModule } from 'app/helpers/shared.module';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';

@Component({
    standalone: true,
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss'],
    imports: [SharedModule],
    providers: [UserClient, LoaderService],
})
export class ConfirmEmailComponent implements OnInit {
    constructor(
        private _userClient: UserClient,
        private _activatedRoute: ActivatedRoute,
        private _loaderService: LoaderService,
        private _logService: LogService,
        private _router: Router,
    ) {}

    async ngOnInit() {
        await this._loaderService.show();
        const urlSegments = ((this._activatedRoute.snapshot as any)._routerState.url as string).split('/');
        const userId = urlSegments[urlSegments.length - 2];
        const code = urlSegments[urlSegments.length - 1];

        if (!userId || !code) {
            await this._logService.toastError('GENERAL.ERROR');
        }

        const request = ConfirmEmailRequest.fromJS({ userId: userId, code: code });
        this._userClient.confirmEmail(request).subscribe({
            next: async () => {
                await this._router.navigateByUrl('/');
                await this._logService.toastSucces('USER.EMAIL_CONFIRMED');
            },
            error: async () => {
                await this._router.navigateByUrl('/');
                await this._logService.toastError('GENERAL.ERROR');
            },
            complete: async () => {
                await this._loaderService.dismiss();
            },
        });
    }
}
