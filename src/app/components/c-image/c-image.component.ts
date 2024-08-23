import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from 'app/services/image.service';

@Component({
    selector: 'c-image',
    templateUrl: './c-image.component.html',
    styleUrls: ['./c-image.component.scss'],
    standalone: true,
    imports: [CommonModule],
    providers: [ImageService],
})
export class CImageComponent implements OnInit {
    @Input() imageGuid!: string;
    @Input() imageType!: 'profilePicture' | 'image';
    @Input() borderRadius: number = 50;
    imageBase64: string;

    constructor(private _imageService: ImageService) {}

    async ngOnInit() {
        if (this.imageType === 'profilePicture') {
            this.imageBase64 = await this._imageService.getProfilePictureImage(this.imageGuid);
        }
    }
}
