import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/helpers/shared.module';
import { TableButton } from 'app/models/table-button';
import { TableColumn } from 'app/models/table-column';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'c-list',
    templateUrl: './c-list.component.html',
    styleUrls: ['./c-list.component.scss'],
    standalone: true,
    imports: [SharedModule, MatTableModule, MatSortModule, MatPaginatorModule, MatRippleModule],
})
export class CListComponent implements OnInit {
    pageSize = 10;

    @Input() dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(undefined);
    @Input() displayedColumns: TableColumn[] = [];
    @Input() entryCount: number;
    @Input() headerButton?: TableButton;
    @Input() itemButton?: TableButton;
    @Input() showPaginator: boolean = true;
    @Output() onAnnounceSortChange = new EventEmitter<Sort>();
    @Output() onPageChange = new EventEmitter<PageEvent>();
    @Output() onRowClick = new EventEmitter<any>();
    @Output() onHeaderButtonClick = new EventEmitter<void>();
    @Output() onItemButtonClick = new EventEmitter<any>();
    displayedColumnIds: string[] = [];
    listLoading = true;

    constructor() {}

    ngOnInit() {
        if (this.headerButton) {
            this.displayedColumns.push(new TableColumn('button', this.headerButton.translationKey));
        }
        if (this.itemButton && !this.headerButton) {
            this.displayedColumns.push(new TableColumn('button', this.itemButton.translationKey));
        }
        this.displayedColumnIds = this.displayedColumns.map((x) => x.id);

        this.dataSource.subscribe((data) => {
            this.listLoading = data === undefined;
        });
    }

    announceSortChange(sortState: Sort) {
        this.onAnnounceSortChange.emit(sortState);
    }

    pageChange(pageChange: PageEvent) {
        this.onPageChange.emit(pageChange);
    }

    rowClick(row) {
        this.onRowClick.emit(row);
    }

    headerButtonClick() {
        this.onHeaderButtonClick.emit();
    }

    itemButtonClick(item, event: PointerEvent) {
        event.stopPropagation();
        this.onItemButtonClick.emit(item);
    }
}
