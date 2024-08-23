import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AccessTokenResponse } from '../api/api-client-generated';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    async setTokens(accessToken: AccessTokenResponse) {
        await Preferences.set({
            key: ACCESS_TOKEN,
            value: accessToken.accessToken!,
        });

        await Preferences.set({
            key: REFRESH_TOKEN,
            value: accessToken.refreshToken!,
        });
    }

    async getAccessToken() {
        return (await Preferences.get({ key: ACCESS_TOKEN })).value;
    }

    async getRefeshToken() {
        return (await Preferences.get({ key: REFRESH_TOKEN })).value;
    }

    async deleteTokens() {
        await Preferences.remove({ key: ACCESS_TOKEN });
        await Preferences.remove({ key: REFRESH_TOKEN });
    }
}
