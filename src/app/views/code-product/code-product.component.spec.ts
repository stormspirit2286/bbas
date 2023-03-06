import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeProductComponent } from './code-product.component';

describe('CodeProductComponent', () => {
  let component: CodeProductComponent;
  let fixture: ComponentFixture<CodeProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
