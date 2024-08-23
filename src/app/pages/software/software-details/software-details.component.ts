import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
    AddSubscriptionTypeRequest,
    IAddSubscriptionTypeRequest,
    IUpdateSoftwareRequest,
    IUpdateSubscriptionTypeRequest,
    SoftwareClient,
    SubscriptionTypeResponse,
    UpdateSoftwareRequest,
    UpdateSubscriptionTypeRequest,
} from 'app/api/api-client-generated';
import { CFormModalComponent } from 'app/components/c-form-modal/c-form-modal.component';
import { CFormComponent } from 'app/components/c-form/c-form.component';
import { CListComponent } from 'app/components/c-list/c-list.component';
import { Helper } from 'app/helpers/Helper';
import { SharedModule } from 'app/helpers/shared.module';
import { TableButton } from 'app/models/table-button';
import { TableColumn } from 'app/models/table-column';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
    selector: 'app-software-details',
    templateUrl: './software-details.component.html',
    styleUrls: ['./software-details.component.scss'],
    standalone: true,
    imports: [SharedModule, CFormComponent, CListComponent],
    providers: [SoftwareClient, LoaderService, LogService],
})
export class SoftwareDetailsComponent implements OnInit {
    softwareId: number;
    formGroup: FormGroup<{
        [Property in keyof IUpdateSoftwareRequest]: FormControl<IUpdateSoftwareRequest[Property]>;
    }>;
    displayedColumns: TableColumn[] = [];
    dataSource: BehaviorSubject<SubscriptionTypeResponse[]> = new BehaviorSubject<SubscriptionTypeResponse[]>(undefined);
    headerButton = new TableButton('SOFTWARE.ADD', 'add');
    itemButton = new TableButton('', 'trash', 'danger');

    constructor(
        _route: ActivatedRoute,
        private _softwareClient: SoftwareClient,
        private _router: Router,
        private _logService: LogService,
        private _loaderService: LoaderService,
        private _modalController: ModalController,
        private _alertController: AlertController,
        private _translateService: TranslateService,
    ) {
        const id = _route.snapshot.paramMap.get('softwareId');
        this.softwareId = new Number(id).valueOf();

        this.displayedColumns = [
            new TableColumn('id', 'SOFTWARE.SUBSCRIPTION_TYPE.ID'),
            new TableColumn('name', 'SOFTWARE.SUBSCRIPTION_TYPE.NAME'),
            new TableColumn('lengthInDays', 'SOFTWARE.SUBSCRIPTION_TYPE.LENGTH_IN_DAYS'),
        ];
    }

    ngOnInit() {
        this._loadData();
    }

    async inputChange() {
        if (this.formGroup.invalid) {
            await this._logService.toastError('GENERAL.CHECK_INPUTS');
            return;
        }

        await this._loaderService.show();
        this._softwareClient
            .updateSoftware(this.formGroup.value as UpdateSoftwareRequest)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe({
                next: async () => {
                    await this._logService.toastSucces('SOFTWARE.SUCCESSFULLY_UPDATED');
                    this._loadData();
                },
                error: async () => {
                    await this._logService.toastError('GENERAL.ERROR');
                },
            });
    }

    async openAddSubscriptionTypeModal() {
        const formGroup = Helper.apiModelToFormGroup<IAddSubscriptionTypeRequest>(AddSubscriptionTypeRequest);

        const softwareId = formGroup.get('softwareId');
        (softwareId as any)._readonly = true;
        const lengthInDays = formGroup.get('lengthInDays');
        (lengthInDays as any)._type = 'number';
        formGroup.controls.softwareId.setValue(this.softwareId);
        formGroup.controls.name.setValidators(Validators.required);
        formGroup.controls.lengthInDays.setValidators(Validators.required);

        Helper.reorderFormGroup(formGroup, AddSubscriptionTypeRequest);

        const modal = await this._modalController.create({
            component: CFormModalComponent<IAddSubscriptionTypeRequest>,
            componentProps: {
                formGroup: formGroup,
                baseTranslateKey: 'SOFTWARE.SUBSCRIPTION_TYPE',
                headerTitle: 'SOFTWARE.SUBSCRIPTION_TYPE.ADD_SUBSCRIPTION',
            },
        });

        await modal.present();

        const { data } = (await modal.onDidDismiss()) as { data: AddSubscriptionTypeRequest };

        if (!data) {
            return;
        }

        await this._loaderService.show();

        this._softwareClient
            .addSubscriptionType(data)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe({
                next: async () => {
                    await this._logService.toastSucces('SOFTWARE.SUBSCRIPTION_TYPE.SUCCESSFULLY_ADDED');
                    this._loadData();
                },
                error: async () => {
                    await this._logService.toastError('SOFTWARE.SUBSCRIPTION_TYPE.COULD_NOT_ADD');
                },
            });
    }

    async openEditSubscriptionTypeModal(subscription: SubscriptionTypeResponse) {
        const formGroup = Helper.apiModelToFormGroup<IUpdateSubscriptionTypeRequest>(UpdateSubscriptionTypeRequest);

        Helper.fillFormWithValues(formGroup, subscription);

        const id = formGroup.get('id');
        (id as any)._readonly = true;
        const lengthInDays = formGroup.get('lengthInDays');
        (lengthInDays as any)._type = 'number';
        formGroup.controls.name.setValidators(Validators.required);
        formGroup.controls.lengthInDays.setValidators(Validators.required);

        Helper.reorderFormGroup(formGroup, UpdateSubscriptionTypeRequest);

        const modal = await this._modalController.create({
            component: CFormModalComponent<IUpdateSubscriptionTypeRequest>,
            componentProps: {
                formGroup: formGroup,
                baseTranslateKey: 'SOFTWARE.SUBSCRIPTION_TYPE',
                headerTitle: 'SOFTWARE.SUBSCRIPTION_TYPE.UPDATE_SUBSCRIPTION',
            },
        });

        await modal.present();

        const { data } = (await modal.onDidDismiss()) as { data: UpdateSubscriptionTypeRequest };

        if (!data) {
            return;
        }

        await this._loaderService.show();

        this._softwareClient
            .updateSubscriptionType(data)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe({
                next: async () => {
                    await this._logService.toastSucces('SOFTWARE.SUBSCRIPTION_TYPE.SUCCESSFULLY_UPDATED');
                    this._loadData();
                },
                error: async () => {
                    await this._logService.toastError('SOFTWARE.SUBSCRIPTION_TYPE.COULD_NOT_UPDATE');
                },
            });
    }

    async deleteSubscriptionType(data: SubscriptionTypeResponse) {
        const alert = await this._alertController.create({
            header: this._translateService.instant('SOFTWARE.SUBSCRIPTION_TYPE.DELETE_TITLE'),
            message: this._translateService.instant('SOFTWARE.SUBSCRIPTION_TYPE.DELETE_MESSAGE', { name: data.name }),
            buttons: [
                {
                    text: this._translateService.instant('GENERAL.NO'),
                    role: 'dismiss',
                },
                {
                    text: this._translateService.instant('GENERAL.YES'),
                    handler: async () => {
                        await this._loaderService.show();
                        this._softwareClient
                            .deleteSubscriptionType(data.id)
                            .pipe(
                                finalize(async () => {
                                    await this._loaderService.dismiss();
                                    this._loadData();
                                }),
                            )
                            .subscribe({
                                next: async () => {
                                    this._logService.toastSucces('SOFTWARE.SUBSCRIPTION_TYPE.DELETE_SUCCESS');
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
        this._softwareClient.getSoftware(this.softwareId).subscribe({
            next: (response) => {
                const formGroup = Helper.apiModelToFormGroup<IUpdateSoftwareRequest>(UpdateSoftwareRequest);
                formGroup.controls.name.setValidators(Validators.required);
                const idControl = formGroup.get('id');
                (idControl as any)._readonly = true;
                formGroup.setControl('id', idControl);
                Helper.fillFormWithValues(formGroup, response);
                Helper.reorderFormGroup<IUpdateSoftwareRequest>(formGroup, UpdateSoftwareRequest);

                this.formGroup = formGroup;
                this.dataSource.next(response.subscriptionTypes);
            },
            error: () => {
                this._router.navigateByUrl('not-found');
            },
        });
    }
}
