import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
    AddSoftwareRequest,
    IAddSoftwareRequest,
    SoftwareClient,
    SoftwareResponse,
    SoftwareSearchOrder,
    SoftwareSearchRequest,
} from 'app/api/api-client-generated';
import { CFormModalComponent } from 'app/components/c-form-modal/c-form-modal.component';
import { CListComponent } from 'app/components/c-list/c-list.component';
import { Helper } from 'app/helpers/Helper';
import { SharedModule } from 'app/helpers/shared.module';
import { TableButton } from 'app/models/table-button';
import { TableColumn } from 'app/models/table-column';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
    selector: 'app-software',
    templateUrl: './software.component.html',
    styleUrls: ['./software.component.scss'],
    standalone: true,
    imports: [SharedModule, CListComponent],
    providers: [SoftwareClient, LoaderService],
})
export class SoftwareComponent implements OnInit {
    entryCount: number;
    displayedColumns: TableColumn[] = [];
    dataSource: BehaviorSubject<SoftwareResponse[]> = new BehaviorSubject<SoftwareResponse[]>(undefined);
    lastRequest: SoftwareSearchRequest;
    pageSize = 10;
    headerButton = new TableButton('SOFTWARE.ADD', 'add');
    itemButton = new TableButton('', 'trash', 'danger');

    constructor(
        private _softwareClient: SoftwareClient,
        private _logService: LogService,
        private _router: Router,
        private _modalController: ModalController,
        private _loaderService: LoaderService,
        private _alertController: AlertController,
        private _translateService: TranslateService,
    ) {
        this.displayedColumns = [
            new TableColumn('id', 'SOFTWARE.ID', SoftwareSearchOrder.Id),
            new TableColumn('name', 'SOFTWARE.NAME', SoftwareSearchOrder.Name),
            new TableColumn('subscriptionTypesCount', 'SOFTWARE.SUBSCIPTION_TYPES'),
        ];
    }

    ngOnInit() {
        this._loadData(
            SoftwareSearchRequest.fromJS({
                pageSize: this.pageSize,
            }),
        );
    }

    announceSortChange(sortState: Sort) {
        this._loadData(
            SoftwareSearchRequest.fromJS({
                userSearchOrder: sortState.direction === '' ? undefined : sortState.active,
                orderDesc: sortState.direction === 'desc',
                pageSize: this.pageSize,
            }),
        );
    }

    onPageChange(pageChange: PageEvent) {
        this.pageSize = pageChange.pageSize;
        this.lastRequest.page = pageChange.pageIndex;
        this.lastRequest.pageSize = this.pageSize;

        this._loadData(this.lastRequest);
    }

    async openAddModal() {
        const formGroup = Helper.apiModelToFormGroup<IAddSoftwareRequest>(AddSoftwareRequest);
        formGroup.controls.name.setValidators(Validators.required);
        const modal = await this._modalController.create({
            component: CFormModalComponent<IAddSoftwareRequest>,
            componentProps: {
                formGroup: formGroup,
                baseTranslateKey: 'SOFTWARE',
                headerTitle: 'SOFTWARE.ADD_SOFTWARE',
            },
        });

        await modal.present();

        const { data } = (await modal.onDidDismiss()) as { data: AddSoftwareRequest };

        if (!data) {
            return;
        }

        await this._loaderService.show();

        this._softwareClient
            .addSoftware(data)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe({
                next: async () => {
                    await this._logService.toastSucces('SOFTWARE.SUCCESSFULLY_ADDED');
                    this._loadData(this.lastRequest);
                },
                error: async () => {
                    await this._logService.toastError('SOFTWARE.COULD_NOT_ADD');
                },
            });
    }

    async gotToSoftwareDetails(software: SoftwareResponse) {
        this._router.navigateByUrl(`admin/software/${software.id}`);
    }

    async deleteSoftware(data: SoftwareResponse) {
        const alert = await this._alertController.create({
            header: this._translateService.instant('SOFTWARE.DELETE_TITLE'),
            message: this._translateService.instant('SOFTWARE.DELETE_MESSAGE', { name: data.name }),
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
                            .deleteSoftware(data.id)
                            .pipe(
                                finalize(async () => {
                                    await this._loaderService.dismiss();
                                    this._loadData(this.lastRequest);
                                }),
                            )
                            .subscribe({
                                next: async () => {
                                    this._logService.toastSucces('SOFTWARE.DELETE_SUCCESS');
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

    private _loadData(request: SoftwareSearchRequest) {
        this.lastRequest = request;
        this._softwareClient.searchSoftware(request).subscribe({
            next: (response) => {
                this.entryCount = response.count;
                this.dataSource.next(response.listEntries);
            },
            error: async () => {
                await this._logService.toastError('ADMIN.USER_MANAGEMENT.SEARCH_USER_ERROR');
            },
        });
    }
}
