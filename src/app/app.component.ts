import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserClient } from './api/api-client-generated';
import { CHeaderComponent } from './components/c-header/c-header.component';
import { AppPage, BACKUP_PAGES, NavService } from './services/nav.service';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    providers: [NavService, UserClient],
    imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule, FontAwesomeModule, TranslateModule, FontAwesomeModule, CHeaderComponent],
})
export class AppComponent {
    public appPages: AppPage[] = [];
    headerTitle: string | undefined;
    headerIcon: IconProp | undefined;

    constructor(
        library: FaIconLibrary,
        private _translate: TranslateService,
        private _navService: NavService,
        private _router: Router,
    ) {
        library.addIconPacks(fas, fab, far);
        _translate.use('en');
        _navService.$navPages.asObservable().subscribe((pages) => {
            this.appPages = pages;
        });

        _router.events.subscribe((e) => {
            if (!(e instanceof NavigationEnd)) {
                return;
            }

            const navEnd = e as NavigationEnd;
            const paths = navEnd.url.split('/');

            let route: AppPage;
            if (paths.length === 2) {
                route = BACKUP_PAGES.find((x) => x.path === navEnd.url);
            } else {
                let currentPage = BACKUP_PAGES.find((x) => this._matchRouteParameters(x.path.split('/'), paths));
                if (!currentPage) {
                    currentPage = BACKUP_PAGES.find((x) => x.path === `/${paths[1]}`);
                    if (currentPage?.pages) {
                        for (let i = 2; i < paths.length; i++) {
                            currentPage = currentPage.pages.find((x) => this._matchChildParameters(x.path, `/${paths[i]}`));
                        }
                    }
                }
                route = currentPage;
            }

            if (route) {
                this.headerTitle = route.title;
                this.headerIcon = route.icon;
                document.title = `${_translate.instant(this.headerTitle)} | ${_translate.instant('GENERAL.TITLE')}`;
            } else {
                this.headerTitle = 'GENERAL.TITLE';
                this.headerIcon = undefined;
                document.title = _translate.instant(this.headerTitle);
            }
        });
    }

    _matchRouteParameters(pagePaths: string[], currentPaths: string[]) {
        if (pagePaths[1] !== currentPaths[1]) {
            return false;
        }

        switch (pagePaths[2]) {
            case 'idPlaceholder':
                return !isNaN(new Number(currentPaths[2]) as number);

            default:
                return false;
        }
    }

    private _matchChildParameters(pagePath: string, currentPath: string) {
        if (pagePath === currentPath) {
            return true;
        }

        switch (pagePath) {
            case 'idPlaceholder':
                return !isNaN(new Number(currentPath.substring(1)) as number);
            default:
                return false;
        }
    }
}
