import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { Role } from 'app/api/api-client-generated';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const adminGuard = (next: ActivatedRouteSnapshot) => {
    return inject(UserService).$userInfoSubject.pipe(
        map((userInfo) => {
            const roleValues = Object.values(Role);
            return userInfo?.roles && userInfo.roles.includes(roleValues.indexOf(Role.Admin) as any) ? true : createUrlTreeFromSnapshot(next, ['/', 'home']);
        }),
    );
};
