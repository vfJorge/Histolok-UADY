import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResultadoComponent } from './modal-resultado.component';

describe('ModalResultadoComponent', () => {
  let component: ModalResultadoComponent;
  let fixture: ComponentFixture<ModalResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResultadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
