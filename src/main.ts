import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NavService } from 'app/services/nav.service';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL, UserClient } from './app/api/api-client-generated';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/helpers/auth.interceptor';
import { LogService } from './app/services/log.service';
import { StorageService } from './app/services/storage.service';
import { UserService } from './app/services/user.service';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

const storageService = new StorageService();

storageService.getAccessToken().then(async (token) => {
    UserService.currentLoggedInStatus = token !== null;
    const userClient = new UserClient(
        new HttpClient(
            new HttpXhrBackend({
                build: () => {
                    const backend = new XMLHttpRequest();
                    const origOpen = XMLHttpRequest.prototype.open;
                    backend.open = (method, url) => {
                        origOpen.apply(backend, [method, url]);
                        backend.setRequestHeader('Authorization', `Bearer ${token}`);
                    };
                    return backend;
                },
            }),
        ),
        environment.apiUrl,
    );

    await firstValueFrom(userClient.currentUserInfo())
        .finally(initApp)
        .then((info) => {
            UserService.currentUser = info;
            const navService = new NavService();
            navService.setNavigationForUser(info);
        });
});

export function initApp() {
    bootstrapApplication(AppComponent, {
        providers: [
            { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
            { provide: API_BASE_URL, useValue: environment.apiUrl },
            {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true,
            },
            importProvidersFrom(
                IonicModule.forRoot({}),
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: createTranslateLoader,
                        deps: [HttpClient],
                    },
                    defaultLanguage: 'en',
                    useDefaultLang: true,
                }),
            ),
            provideRouter(routes),
            UserClient,
            LogService,
            provideAnimations(),
        ],
    });
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
