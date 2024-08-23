import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserInfoComponent } from 'app/pages/user/user-info/user-info.component';

@Component({
    standalone: true,
    selector: 'c-header',
    templateUrl: './c-header.component.html',
    styleUrls: ['./c-header.component.scss'],
    imports: [CommonModule, IonicModule, TranslateModule, UserInfoComponent, FontAwesomeModule],
})
export class CHeaderComponent implements OnInit {
    @Input() _text_!: string;
    @Input() _icon_?: IconProp | undefined;
    constructor() {}

    ngOnInit() {}
}
