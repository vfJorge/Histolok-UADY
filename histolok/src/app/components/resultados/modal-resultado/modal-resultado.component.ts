import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-resultado',
  templateUrl: './modal-resultado.component.html',
  styleUrls: ['./modal-resultado.component.css']
})
export class ModalResultadoComponent implements OnInit {
  imagenesURL = "http://127.0.0.1:8000/storage/";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<ModalResultadoComponent>
  ) { }

  ngOnInit(): void {
  }

  cerrar(){
    this.dialogRef.close()
  }
}
