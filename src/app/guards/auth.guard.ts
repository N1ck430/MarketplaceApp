import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const authGuard = (next: ActivatedRouteSnapshot) => {
    return inject(UserService).isLoggedIn.pipe(map((isLoggedIn) => (isLoggedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'user', 'login']))));
};
