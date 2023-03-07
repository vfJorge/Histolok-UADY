import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImagenPreguntaComponent } from './modal-imagen-pregunta.component';

describe('ModalImagenPreguntaComponent', () => {
  let component: ModalImagenPreguntaComponent;
  let fixture: ComponentFixture<ModalImagenPreguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImagenPreguntaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImagenPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
