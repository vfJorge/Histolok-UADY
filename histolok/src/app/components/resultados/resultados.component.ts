import { Component, OnInit } from '@angular/core';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalResultadoComponent } from './modal-resultado/modal-resultado.component';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  examenID: any; //La debe otorgar el clickear en iniciar examen
  resultados: any;
  respuestas: any;
  imagenesURL = "http://127.0.0.1:8000/storage/";

  constructor(private adminExamenesService: AdminExamenesService,
    private adminQuestionsService: AdminQuestionsService,
    private adminImagesService: AdminImagesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.examenID = localStorage.getItem('ExamenID');
    this.adminExamenesService.resultadosExamen(this.examenID).subscribe((resp: any) => {
      this.resultados = resp.body.pivote;
      console.log(resp.body);
      }, error => {
      console.log(error);
    })
  }


  mostrarImagen(imagen: any){
    this.dialog.open(ModalResultadoComponent, {
      height: '100%',
      width: '100%',
      data: {imagePath: this.imagenesURL + imagen},
      autoFocus: false
    })
  }
}
