import { Injectable } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject } from 'rxjs';
import { ExtendedInfoResponse, Role } from '../api/api-client-generated';

export class AppPage {
    title!: string;
    path!: string;
    icon?: IconProp;
    roles!: Role[];
    pages?: AppPage[];
}

export const BACKUP_PAGES: AppPage[] = [
    {
        title: 'Home',
        path: '/home',
        roles: [Role.User],
        icon: 'home',
    },
    {
        title: 'ADMIN.ADMIN',
        path: '/admin',
        roles: [Role.Admin],
        icon: 'user-astronaut',
        pages: [
            {
                title: 'ADMIN.USER_MANAGEMENT.USER_MANAGEMENT',
                path: '/user-management',
                roles: [Role.Admin],
                icon: 'users',
            },
            {
                title: 'SOFTWARE.SOFTWARE',
                path: '/software',
                roles: [Role.Admin],
                icon: 'code',
                pages: [
                    {
                        title: 'SOFTWARE.DETAILS',
                        path: 'idPlaceholder',
                        roles: [],
                        icon: 'terminal',
                    },
                ],
            },
        ],
    },
    {
        title: 'USER.DETAILS',
        path: '/user/idPlaceholder',
        roles: [],
        icon: 'user',
    },
    {
        title: 'GENERAL.NOT_FOUND',
        path: '/not-found',
        roles: [],
        icon: 'ban',
    },
];

@Injectable({
    providedIn: 'root',
})
export class NavService {
    $navPages = new BehaviorSubject<AppPage[]>([]);
    constructor() {}

    setNavigationForUser(info: ExtendedInfoResponse) {
        const roleValues = Object.values(Role);
        let pages: AppPage[] = [];
        BACKUP_PAGES.forEach((page) => {
            info?.roles?.forEach((r: any) => {
                const requiredRole = Role[roleValues[r]];
                if (page.roles.includes(requiredRole)) {
                    if (page.pages) {
                        page.pages = page.pages.filter((p) => p.roles.includes(requiredRole));
                    }
                    pages.push(page);
                    return;
                }
            });
        });
        this.$navPages.next(pages);
    }

    deleteNavigations() {
        this.$navPages.next([]);
    }
}
