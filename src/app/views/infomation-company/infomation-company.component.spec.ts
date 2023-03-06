import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfomationCompanyComponent } from './infomation-company.component';

describe('InfomationCompanyComponent', () => {
  let component: InfomationCompanyComponent;
  let fixture: ComponentFixture<InfomationCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfomationCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfomationCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
