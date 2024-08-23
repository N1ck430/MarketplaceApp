import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

const MAX_LOADER_DURATION = 5000;

@Injectable()
export class LoaderService {
    constructor(private _loadingController: LoadingController) {}
    async show() {
        const loader = await this._loadingController.create({
            duration: MAX_LOADER_DURATION,
        });

        await loader.present();
    }

    async dismiss() {
        const top = await this._loadingController.getTop();

        if (top === undefined) {
            return;
        }

        await this._loadingController.dismiss();
    }
}
