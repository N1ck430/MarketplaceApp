import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ExtendedInfoResponse, Role, SubscriptionResponse, UserClient } from 'app/api/api-client-generated';
import { CListComponent } from 'app/components/c-list/c-list.component';
import { CSelectComponent } from 'app/components/input/c-select/c-select.component';
import { SharedModule } from 'app/helpers/shared.module';
import { AddSubscriptionModalComponent } from 'app/modals/add-subscription-modal/add-subscription-modal.component';
import { SelectItem } from 'app/models/select-item';
import { TableButton } from 'app/models/table-button';
import { TableColumn } from 'app/models/table-column';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';
import { UserService } from 'app/services/user.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    standalone: true,
    imports: [SharedModule, ProfilePictureComponent, CSelectComponent, ReactiveFormsModule, CListComponent],
    providers: [LoaderService, DatePipe],
})
export class DetailsComponent implements OnInit {
    userId: number;
    userInfo: ExtendedInfoResponse;
    isAdmin = false;
    isOwnAccount = false;
    isLoading = true;
    formGroup: FormGroup;
    roleItems: SelectItem[];
    displayedColumns: TableColumn[] = [];
    dataSource: BehaviorSubject<SubscriptionResponse[]> = new BehaviorSubject<SubscriptionResponse[]>(undefined);
    headerButton = new TableButton('GENERAL.ADD', 'add');

    constructor(
        _route: ActivatedRoute,
        private _userClient: UserClient,
        private _userService: UserService,
        private _router: Router,
        private _fb: FormBuilder,
        private _logService: LogService,
        private _loaderService: LoaderService,
        private _alertController: AlertController,
        private _translateService: TranslateService,
        private _datePipe: DatePipe,
        private _modalController: ModalController,
    ) {
        const id = _route.snapshot.paramMap.get('userSequenceId');
        this.userId = new Number(id).valueOf();
        this.isAdmin = this._userService.isInRole(Role.Admin);
        this.roleItems = Object.keys(Role).map((v, i) => new SelectItem(i, v));
        this.displayedColumns = [
            new TableColumn('softwareName', 'SUBSCRIPTION.SOFTWARE_NAME'),
            new TableColumn('subscriptionTypeName', 'SUBSCRIPTION.SUBSCRIPTION_TYPE'),
            new TableColumn('endDateString', 'SUBSCRIPTION.END_DATE'),
            new TableColumn('timeRemainingString', 'SUBSCRIPTION.TIME_REMAINING'),
        ];
    }

    async ngOnInit() {
        this.isOwnAccount = this._userService.$userInfoSubject.getValue().userSequenceId === this.userId;
        this._loadData();
    }

    async confirmLockout() {
        const alert = await this._alertController.create({
            header: this._translateService.instant('USER.LOCKOUT_USER_TITLE'),
            message: this._translateService.instant('USER.LOCKOUT_USER_MESSAGE', { userName: this.userInfo.username }),
            buttons: [
                {
                    text: this._translateService.instant('GENERAL.NO'),
                    role: 'dismiss',
                },
                {
                    text: this._translateService.instant('GENERAL.YES'),
                    handler: async () => {
                        await this._loaderService.show();
                        this._userClient
                            .lockOutUser(this.userInfo.userId)
                            .pipe(
                                finalize(async () => {
                                    await this._loaderService.dismiss();
                                }),
                            )
                            .subscribe({
                                next: async () => {
                                    this._logService.toastSucces('USER.LOCKOUT_USER_SUCCESS');
                                },
                                error: async () => {
                                    this._logService.toastError('GENERAL.ERROR');
                                },
                            });
                    },
                },
            ],
        });

        await alert.present();
    }

    private _loadData() {
        this._getUserInfo()
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe({
                next: (info) => {
                    this.userInfo = info;
                    this.formGroup = this._fb.group({
                        roles: new FormControl(info.roles, Validators.required),
                    });
                    if (this.userInfo.subscriptions) {
                        this.userInfo.subscriptions.forEach((element) => {
                            (element as any)._disabled = !element.isActive;
                            (element as any).endDateString = this._datePipe.transform(element.endDate, 'dd.MM.YYYY hh:mm:ss');
                            (element as any).timeRemainingString = element.isActive
                                ? this._translateService.instant('GENERAL.TIME_SPAN_FORMAT', {
                                      days: element.timeRemaining.days,
                                      hours: element.timeRemaining.hours,
                                      minutes: element.timeRemaining.minutes,
                                  })
                                : '-';
                        });
                        this.dataSource.next(this.userInfo.subscriptions);
                    }
                },
                error: () => {
                    this._router.navigateByUrl('not-found');
                },
            });
    }

    private _getUserInfo() {
        if (this.isOwnAccount) {
            return this._userClient.currentUserInfo();
        } else if (this.isAdmin) {
            return this._userClient.extendedUserInfo(this.userId);
        } else {
            return this._userClient.userInfo(this.userId);
        }
    }

    async roleChange(event: {
        detail: {
            value: Role[];
        };
    }) {
        if (!event.detail.value.length) {
            await this._logService.toastError('USER.ROLES_REQUIRED');
            return;
        }

        await this._loaderService.show();
        this._userClient
            .updateUserRoles(this.userInfo.userId, event.detail.value)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe({
                next: async () => await this._logService.toastSucces('USER.ROLES_UPDATED'),
                error: async () => await this._logService.toastError('GENERAL.ERROR'),
            });
    }

    async addSubscriptionModal() {
        const modal = await this._modalController.create({
            component: AddSubscriptionModalComponent,
            componentProps: {
                userId: this.userInfo.userId,
            },
        });

        await modal.present();

        const { data } = await modal.onDidDismiss();

        if (data) {
            this._loadData();
        }
    }
}
