import { Component, Input, OnInit } from '@angular/core';
import { ImageClient } from 'app/api/api-client-generated';
import { CImageComponent } from 'app/components/c-image/c-image.component';
import { SharedModule } from 'app/helpers/shared.module';

@Component({
    selector: 'app-profile-picture',
    templateUrl: './profile-picture.component.html',
    styleUrls: ['./profile-picture.component.scss'],
    standalone: true,
    imports: [SharedModule, CImageComponent],
    providers: [ImageClient],
})
export class ProfilePictureComponent implements OnInit {
    @Input() userId!: string;

    imageSource: string;

    constructor() {}

    ngOnInit() {}
}
