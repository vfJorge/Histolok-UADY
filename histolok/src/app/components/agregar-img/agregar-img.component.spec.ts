import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarImgComponent } from './agregar-img.component';

describe('AgregarImgComponent', () => {
  let component: AgregarImgComponent;
  let fixture: ComponentFixture<AgregarImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
