/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CHeaderComponent } from './c-header.component';

describe('CHeaderComponent', () => {
    let component: CHeaderComponent;
    let fixture: ComponentFixture<CHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CHeaderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
