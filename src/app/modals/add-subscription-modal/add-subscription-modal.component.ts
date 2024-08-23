import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SoftwareClient, SoftwareSearchRequest, SubscriptionClient } from 'app/api/api-client-generated';
import { CSelectComponent } from 'app/components/input/c-select/c-select.component';
import { SharedModule } from 'app/helpers/shared.module';
import { SelectItem } from 'app/models/select-item';
import { LoaderService } from 'app/services/loader.service';
import { LogService } from 'app/services/log.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'add-subscription-modal',
    templateUrl: './add-subscription-modal.component.html',
    styleUrls: ['./add-subscription-modal.component.scss'],
    standalone: true,
    imports: [SharedModule, ReactiveFormsModule, CSelectComponent],
    providers: [SoftwareClient, SubscriptionClient, LoaderService, LogService],
})
export class AddSubscriptionModalComponent implements OnInit {
    @Input() userId!: string;

    formGroup: FormGroup;
    softwares: SelectItem[] = [];
    subscriptionTypes: SelectItem[] = [];

    constructor(
        private _modalController: ModalController,
        private _fb: FormBuilder,
        private _softwareClient: SoftwareClient,
        private _subscriptionClient: SubscriptionClient,
        private _loaderService: LoaderService,
        private _logService: LogService,
    ) {}

    async ngOnInit() {
        await this._loaderService.show();
        this.formGroup = this._fb.group({
            softwareType: new FormControl('', Validators.required),
            subscriptionType: new FormControl('', Validators.required),
        });

        this._softwareClient
            .searchSoftware(
                SoftwareSearchRequest.fromJS({
                    page: 0,
                    pageSize: 99999,
                }),
            )
            .pipe(
                finalize(async () => {
                    await this._loaderService.dismiss();
                }),
            )
            .subscribe((softwareSearchResponse) => {
                this.softwares = softwareSearchResponse.listEntries.map((x) => new SelectItem(x.id, `${x.name} (${x.subscriptionTypesCount})`));
            });
    }

    async onSubmit(value) {
        await this._loaderService.show();
        this._subscriptionClient
            .addSubscriptionToUser(this.userId, value.subscriptionType)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe({
                next: async () => {
                    await this._logService.toastSucces('SOFTWARE.SUCCESSFULLY_ADDED');
                    await this._modalController.dismiss(true);
                },
                error: async () => {
                    await this._logService.toastError('SOFTWARE.COULD_NOT_ADD');
                },
            });
    }

    async subscriptionTypeChange() {
        await this._loaderService.show();
        this.subscriptionTypes = [];
        this.formGroup.controls['subscriptionType'].setValue(undefined);

        this._softwareClient
            .getSoftware(this.formGroup.value.softwareType)
            .pipe(finalize(async () => await this._loaderService.dismiss()))
            .subscribe((software) => {
                this.subscriptionTypes = software.subscriptionTypes.map((x) => new SelectItem(x.id, `${x.lengthInDays} (${x.lengthInDays})`));
            });
    }

    async close() {
        await this._modalController.dismiss();
    }
}
