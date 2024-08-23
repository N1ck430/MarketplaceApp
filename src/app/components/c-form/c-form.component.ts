import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'app/helpers/shared.module';
import { CInputComponent } from '../input/c-input/c-input.component';

const UPPERCASE_REGEX = new RegExp('[A-Z]');

@Component({
    selector: 'c-form',
    templateUrl: './c-form.component.html',
    styleUrls: ['./c-form.component.scss'],
    imports: [SharedModule, ReactiveFormsModule, CInputComponent],
    standalone: true,
})
export class CFormComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() baseTranslateKey: string;
    @Output() submit = new EventEmitter<any>();
    @Output() onInputChange = new EventEmitter<any>();

    formControls: {
        formControl: string;
        labelText: string;
        mandatory: boolean;
        readonly: boolean;
        disabled: boolean;
        type: string;
    }[];

    constructor() {}

    ngOnInit() {
        this.formControls = Object.keys(this.formGroup.controls).map((k) => {
            const formControl = this.formGroup.get(k);
            return {
                formControl: k,
                labelText: `${this.baseTranslateKey}.${k.replace(/[A-Z]/g, (m) => `_${m}`).toUpperCase()}`,
                mandatory: formControl.hasValidator(Validators.required),
                readonly: (formControl as any)._readonly ?? false,
                disabled: (formControl as any)._disabled ?? false,
                type: (formControl as any)._type ?? 'text',
            };
        });
    }

    onSubmit(formValue) {
        this.submit.emit(formValue);
    }

    onChange(event) {
        this.onInputChange.emit(event);
    }
}
