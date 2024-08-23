import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Color } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_DURATION = 3000;

@Injectable({
    providedIn: 'root',
})
export class LogService {
    constructor(
        private _toastController: ToastController,
        private _translateService: TranslateService,
    ) {}

    async toastSucces(message: string) {
        await this.presentToast(message, 'success');
    }

    async toastError(message: string) {
        await this.presentToast(message, 'danger');
    }

    async toastInfo(message: string) {
        await this.presentToast(message, 'secondary');
    }

    async toastWarning(message: string) {
        await this.presentToast(message, 'warning');
    }

    private async presentToast(message: string, color: Color) {
        const toast = await this._toastController.create({
            message: this._translateService.instant(message),
            color,
            duration: DEFAULT_DURATION,
        });

        await toast.present();
    }
}
