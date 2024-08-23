import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXhrBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, firstValueFrom, from, lastValueFrom, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AccessTokenResponse, UserClient } from '../api/api-client-generated';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private _storageService: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.interceptAsync(req, next));
    }

    async interceptAsync(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        let authReq = req;
        const token = await this._storageService.getAccessToken();

        if (token != null) {
            authReq = this.addTokenHeader(req, token);
        }

        return (await lastValueFrom(
            next.handle(authReq).pipe(
                catchError(async (error) => {
                    if (error instanceof HttpErrorResponse && !authReq.url.toLocaleLowerCase().includes('/user/login') && error.status === 401) {
                        const handle = await this.handle401Error(authReq, next);
                        return handle;
                    }
                    throw error;
                }),
            ),
        )) as HttpEvent<any>;
    }

    private async handle401Error(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const service = new UserClient(
                new HttpClient(
                    new HttpXhrBackend({
                        build: () => new XMLHttpRequest(),
                    }),
                ),
                environment.apiUrl,
            );

            const refreshToken = await this._storageService.getRefeshToken();

            if (refreshToken === null) {
                return throwError(new Error()) as any;
            }

            return await firstValueFrom(
                service.refresh(refreshToken).pipe(
                    switchMap(async (tokenResponse: AccessTokenResponse) => {
                        this.isRefreshing = false;
                        await this._storageService.setTokens(tokenResponse);

                        this.refreshTokenSubject.next(tokenResponse.accessToken);

                        return await firstValueFrom(next.handle(this.addTokenHeader(request, tokenResponse.accessToken!)));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        firstValueFrom(from(this._storageService.deleteTokens()));
                        return throwError(err);
                    }),
                ),
            );
        }

        return await firstValueFrom(
            this.refreshTokenSubject.pipe(
                filter((token) => token !== null),
                take(1),
                switchMap((token) => next.handle(this.addTokenHeader(request, token))),
            ),
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`),
        });
    }
}
