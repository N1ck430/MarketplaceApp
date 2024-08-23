import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'c-input',
    templateUrl: './c-input.component.html',
    styleUrls: ['./c-input.component.scss'],
    imports: [IonicModule, ReactiveFormsModule, TranslateModule, CommonModule],
})
export class CInputComponent implements OnInit {
    @Input() _formGroup_!: FormGroup;

    @Input() _formControlName_!: string;

    @Input() _labelText_!: string;

    @Input() _type_: string = 'text';

    @Input() _mandatory_: boolean = false;

    @Input() _readonly_: boolean = false;

    @Input() _disabled_: boolean = false;

    @Output() onChange = new EventEmitter<any>();

    constructor() {}

    ngOnInit() {}

    change(event) {
        this.onChange.emit(event);
    }
}
