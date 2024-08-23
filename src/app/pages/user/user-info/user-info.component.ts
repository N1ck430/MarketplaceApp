import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExtendedInfoResponse } from 'app/api/api-client-generated';
import { SharedModule } from 'app/helpers/shared.module';
import { UserService } from 'app/services/user.service';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';

@Component({
    standalone: true,
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
    imports: [SharedModule, ProfilePictureComponent],
    providers: [UserService],
})
export class UserInfoComponent implements OnInit {
    userInfo: ExtendedInfoResponse | undefined;
    constructor(
        private _userService: UserService,
        private _router: Router,
    ) {}

    ngOnInit() {
        this._userService.$userInfoSubject.subscribe((info) => {
            this.userInfo = info;
        });
    }

    async logout() {
        await this._userService.logout();
    }

    async login() {
        await this._router.navigateByUrl('/user/login');
    }
}
