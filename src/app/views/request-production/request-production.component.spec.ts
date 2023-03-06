import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestProductionComponent } from './request-production.component';

describe('RequestProductionComponent', () => {
  let component: RequestProductionComponent;
  let fixture: ComponentFixture<RequestProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
