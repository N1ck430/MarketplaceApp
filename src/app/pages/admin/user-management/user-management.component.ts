import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { InfoResponse, Role, UserClient, UserSearchOrder, UserSearchRequest } from 'app/api/api-client-generated';
import { CListComponent } from 'app/components/c-list/c-list.component';
import { SharedModule } from 'app/helpers/shared.module';
import { TableColumn } from 'app/models/table-column';
import { LogService } from 'app/services/log.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
    standalone: true,
    imports: [SharedModule, MatTableModule, MatSortModule, MatPaginatorModule, CListComponent],
    providers: [DatePipe],
})
export class UserManagementComponent implements OnInit {
    userInfos: InfoResponse[] = [];
    entryCount: number;
    displayedColumns: TableColumn[] = [];
    dataSource: BehaviorSubject<InfoResponse[]> = new BehaviorSubject<InfoResponse[]>(undefined);
    lastRequest: UserSearchRequest;
    pageSize = 10;

    constructor(
        private _userClient: UserClient,
        private _logService: LogService,
        private _router: Router,
        private _datePipe: DatePipe,
    ) {
        this.displayedColumns = [
            new TableColumn('userSequenceId', 'USER.USERID', UserSearchOrder.Id),
            new TableColumn('username', 'USER.USER_NAME', UserSearchOrder.Name),
            new TableColumn('roleNames', 'USER.ROLES'),
            new TableColumn('registerDateString', 'USER.REGISTER_DATE', UserSearchOrder.RegisterDate),
        ];
    }

    ngOnInit() {
        this._loadData(
            UserSearchRequest.fromJS({
                pageSize: this.pageSize,
            }),
        );
    }

    private _displayRoles(roles: Role[]) {
        return roles.map((r) => Object.keys(Role)[r]).join(', ');
    }

    announceSortChange(sortState: Sort) {
        this._loadData(
            UserSearchRequest.fromJS({
                userSearchOrder: sortState.direction === '' ? undefined : sortState.active,
                orderDesc: sortState.direction === 'desc',
                pageSize: this.pageSize,
            }),
        );
    }

    onPageChange(pageChange: PageEvent) {
        this.pageSize = pageChange.pageSize;
        this.lastRequest.page = pageChange.pageIndex;
        this.lastRequest.pageSize = this.pageSize;

        this._loadData(this.lastRequest);
    }

    async gotToUserDetails(info: InfoResponse) {
        this._router.navigateByUrl(`user/${info.userSequenceId}`);
    }

    private _loadData(request: UserSearchRequest) {
        this.lastRequest = request;
        this.userInfos = [];
        this._userClient.searchUsers(request).subscribe({
            next: (response) => {
                this.entryCount = response.count;
                response.listEntries.forEach((element) => {
                    (element as any).roleNames = this._displayRoles(element.roles);
                    (element as any).registerDateString = this._datePipe.transform(element.registerDate, 'dd.MM.YYYY hh:mm:ss');
                    this.userInfos.push(element);
                });
                this.dataSource.next(this.userInfos);
            },
            error: async () => {
                await this._logService.toastError('ADMIN.USER_MANAGEMENT.SEARCH_USER_ERROR');
            },
        });
    }
}
