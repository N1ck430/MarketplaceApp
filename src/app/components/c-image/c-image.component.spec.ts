/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CImageComponent } from './c-image.component';

describe('CImageComponent', () => {
    let component: CImageComponent;
    let fixture: ComponentFixture<CImageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CImageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
