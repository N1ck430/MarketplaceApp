import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'app/helpers/shared.module';

@Component({
    standalone: true,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [SharedModule],
})
export class HomeComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
