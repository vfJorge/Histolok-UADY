import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalQuestionsComponent } from '../../questions/modal-questions/modal-questions.component';

@Component({
  selector: 'app-modal-examen',
  templateUrl: './modal-examen.component.html',
  styleUrls: ['./modal-examen.component.css']
})
export class ModalExamenComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<ModalQuestionsComponent>
  ) { }

  ngOnInit(): void {
  }

  cerrar(){
    this.dialogRef.close()
  }
}
