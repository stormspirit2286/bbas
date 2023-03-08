import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfomationProductionComponent } from './infomation-production.component';

describe('InfomationProductionComponent', () => {
  let component: InfomationProductionComponent;
  let fixture: ComponentFixture<InfomationProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfomationProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfomationProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
