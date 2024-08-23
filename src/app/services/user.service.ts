import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, take } from 'rxjs';
import { AccessTokenResponse, ExtendedInfoResponse, Role, UserClient } from '../api/api-client-generated';
import { LogService } from './log.service';
import { NavService } from './nav.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private loggedIn: BehaviorSubject<boolean>;
    public $userInfoSubject: BehaviorSubject<ExtendedInfoResponse | undefined>;
    public static currentLoggedInStatus = false;
    public static currentUser?: ExtendedInfoResponse = undefined;

    constructor(
        private _storageService: StorageService,
        private _navService: NavService,
        private _router: Router,
        private _logService: LogService,
        private _userClient: UserClient,
    ) {
        this.loggedIn = new BehaviorSubject<boolean>(UserService.currentLoggedInStatus);
        this.$userInfoSubject = new BehaviorSubject<ExtendedInfoResponse | undefined>(UserService.currentUser);

        this.init();
    }

    get isLoggedIn() {
        from(this._storageService.getAccessToken())
            .pipe(take(1))
            .subscribe((token) => {
                this.loggedIn.next(token !== null);
            });
        return this.loggedIn.asObservable();
    }

    async login(accessToken: AccessTokenResponse) {
        this.loggedIn.next(true);
        await this._storageService.setTokens(accessToken);
        await this._logService.toastSucces('USER.LOGGED_IN');
        this.init();
        window.location.reload();
    }

    async logout() {
        await this._storageService.deleteTokens();
        this._navService.deleteNavigations();
        await this._router.navigateByUrl('/');
        this.loggedIn.next(false);
        this.$userInfoSubject.next(undefined);
        window.location.reload();
    }

    init() {
        this._userClient.currentUserInfo().subscribe((info) => {
            this.$userInfoSubject.next(info);
            this._navService.setNavigationForUser(info);
        });
    }

    isInRole(role: Role) {
        const roleValues = Object.values(Role);
        return this.$userInfoSubject.getValue().roles.includes(roleValues.indexOf(role) as any);
    }
}
