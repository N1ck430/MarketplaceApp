import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'app/helpers/shared.module';
import { UserService } from 'app/services/user.service';
import { take } from 'rxjs';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
    standalone: true,
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    imports: [SharedModule, SwiperModule, LoginComponent, RegisterComponent, ConfirmEmailComponent, ForgotPasswordComponent],
    providers: [],
})
export class UserComponent implements OnInit {
    @ViewChild('swiper') swiper!: SwiperComponent;

    constructor(
        private location: Location,
        private _router: Router,
        private _userService: UserService,
    ) {
        _userService.isLoggedIn.pipe(take(2)).subscribe((loggedIn) => {
            if (loggedIn) {
                _router.navigateByUrl('/home');
            }
        });
    }

    async ngOnInit() {
        await this.swiper;
        const route = this.location.path();
        if (route === '/user/register') {
            this.swiper.swiperRef.slideTo(1);
        }
    }

    navigate(url: string) {
        this._router.navigateByUrl(url);
        if (url === '/user/register') {
            this.swiper.swiperRef.slideTo(1);
        } else if (url === '/user/login') {
            this.swiper.swiperRef.slideTo(0);
        } else {
            this.swiper.swiperRef.slideTo(2);
        }
    }

    getPath() {
        return this.location.path();
    }

    forgotPassword() {
        this.navigate('/user/forgot-password');
    }
}
