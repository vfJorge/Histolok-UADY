import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-resultados-alumno',
  templateUrl: './modal-resultados-alumno.component.html',
  styleUrls: ['./modal-resultados-alumno.component.css']
})
export class ModalResultadosAlumnoComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Array<any> =[], 
    public dialogRef: MatDialogRef<ModalResultadosAlumnoComponent>
  ) {}

  ngOnInit(): void {
  }

  cerrar(){
    this.dialogRef.close()
  }
}
