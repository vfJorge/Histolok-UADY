import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResultadosAlumnoComponent } from './modal-resultados-alumno.component';

describe('ModalResultadosAlumnoComponent', () => {
  let component: ModalResultadosAlumnoComponent;
  let fixture: ComponentFixture<ModalResultadosAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResultadosAlumnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalResultadosAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
