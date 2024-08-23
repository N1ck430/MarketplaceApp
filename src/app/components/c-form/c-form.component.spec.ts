/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CFormComponent } from './c-form.component';

describe('CFormComponent', () => {
    let component: CFormComponent;
    let fixture: ComponentFixture<CFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
