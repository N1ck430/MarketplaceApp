import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SharedModule } from 'app/helpers/shared.module';
import { CFormComponent } from '../c-form/c-form.component';

@Component({
    selector: 'app-c-form-modal',
    templateUrl: './c-form-modal.component.html',
    styleUrls: ['./c-form-modal.component.scss'],
    standalone: true,
    imports: [SharedModule, CFormComponent],
})
export class CFormModalComponent<T> implements OnInit {
    @Input() formGroup: FormGroup<{
        [Property in keyof T]: FormControl<T[Property]>;
    }>;
    @Input() baseTranslateKey: string;
    @Input() headerTitle: string;

    constructor(private _modalController: ModalController) {}

    ngOnInit() {}

    async submit(formValue: T) {
        await this._modalController.dismiss(formValue);
    }

    async close() {
        await this._modalController.dismiss();
    }
}
