import { Injectable } from '@angular/core';
import { FileResponse, ImageClient } from 'app/api/api-client-generated';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImageService {
    constructor(private _imageClient: ImageClient) {}

    async getProfilePictureImage(userId: string) {
        const imageResult = await firstValueFrom(this._imageClient.getProfilePicture(userId));
        return this.blobToBase64(imageResult);
    }

    private blobToBase64(imageResult: FileResponse): Promise<string> {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(imageResult.data);
        });
    }
}
