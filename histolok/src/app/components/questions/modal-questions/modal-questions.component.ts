import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-questions',
  templateUrl: './modal-questions.component.html',
  styleUrls: ['./modal-questions.component.css']
})
export class ModalQuestionsComponent implements OnInit {

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
