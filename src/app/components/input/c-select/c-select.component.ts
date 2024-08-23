import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectItem } from 'app/models/select-item';

@Component({
    selector: 'c-select',
    templateUrl: './c-select.component.html',
    styleUrls: ['./c-select.component.scss'],
    standalone: true,
    imports: [IonicModule, ReactiveFormsModule, TranslateModule, CommonModule],
})
export class CSelectComponent implements OnInit {
    @Input() _formGroup_!: FormGroup;

    @Input() _formControlName_!: string;

    @Input() _labelText_!: string;

    @Input() _multiple_: boolean = false;

    @Input() _items_!: SelectItem[];

    @Input() _mandatory_: boolean = false;

    @Input() _disabled_: boolean = false;

    @Output() onChange: EventEmitter<{
        detail: {
            value: any;
        };
    }> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    change(event) {
        this.onChange.emit(event);
    }
}
