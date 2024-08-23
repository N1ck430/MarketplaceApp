import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'app/helpers/shared.module';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    standalone: true,
    imports: [SharedModule],
})
export class NotFoundComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
