/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CFormModalComponent } from './c-form-modal.component';

describe('CFormModalComponent', () => {
    let component: CFormModalComponent;
    let fixture: ComponentFixture<CFormModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CFormModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CFormModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
