import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-imagen-pregunta',
  templateUrl: './modal-imagen-pregunta.component.html',
  styleUrls: ['./modal-imagen-pregunta.component.css']
})
export class ModalImagenPreguntaComponent implements OnInit {
  imagenesURL = "http://127.0.0.1:8000/storage/";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<ModalImagenPreguntaComponent>
  ) { }

  ngOnInit(): void {
  }

  cerrar(){
    this.dialogRef.close()
  }
}
