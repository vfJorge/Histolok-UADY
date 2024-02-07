import { Component, OnInit } from '@angular/core';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalResultadoComponent } from './modal-resultado/modal-resultado.component';
import { PATH_SERVER_IMGS } from 'src/app/serverconfig';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  examenID: any; //La debe otorgar el clickear en iniciar examen
  resultados: any;
  incisosExamen: any;
  arrayRespuestas: any[];
  retroalimentacionRCorrecta: any;
  retroalimentacionRUser: any;
  arrayRetros: any[];
  imagenesURL = PATH_SERVER_IMGS;

  constructor(private adminExamenesService: AdminExamenesService,
    private adminQuestionsService: AdminQuestionsService,
    private adminImagesService: AdminImagesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.examenID = localStorage.getItem('ExamenID');
    this.adminExamenesService.resultadosExamen(this.examenID).subscribe((resp: any) => {
      this.resultados = resp.body.pivote;
      this.arrayRespuestas = resp.body.respuestas;
      console.log(resp.body);
      }, error => {
      console.log(error);
    })
    this.adminExamenesService.verExamen(this.examenID).subscribe((resp: any) => {
      this.incisosExamen = resp.body.preguntas;
      console.log(resp.body);
    })
  }

  respuestasCorrectasYUsuario(idRespuesta: string, numPregunta: any){
    let stringRespCorrecta: any;
    let stringRespUsuario: any;
    let i: any;
    
    for(i = 0; i < this.incisosExamen[numPregunta].opcions.length; i++){
      if (this.incisosExamen[numPregunta].opcions[i].id == idRespuesta[0]){
        stringRespCorrecta = "La respuesta correcta era: "+this.incisosExamen[numPregunta].opcions[i].opcion;
        stringRespUsuario = "Tu respuesta fue: "+this.incisosExamen[numPregunta].opcions[i].opcion;
      }
    }
    
    if(idRespuesta.split(',')[0] != idRespuesta.split(',')[1]){
      for(i = 0; i < this.incisosExamen[numPregunta].opcions.length; i++){
        if (this.incisosExamen[numPregunta].opcions[i].id == idRespuesta.split(',')[0]){
          stringRespCorrecta = "La respuesta correcta era: "+this.incisosExamen[numPregunta].opcions[i].opcion;
        }
        
        if (this.incisosExamen[numPregunta].opcions[i].id == idRespuesta.split(',')[1]){
          stringRespUsuario = "Tu respuesta fue: "+this.incisosExamen[numPregunta].opcions[i].opcion;
        }
      }
    }
    
    this.retroalimentacionRCorrecta = stringRespCorrecta;
    this.retroalimentacionRUser = stringRespUsuario;
  }


  mostrarImagen(imagen: any){
    this.dialog.open(ModalResultadoComponent, {
      height: '90%',
      width: '50%',
      data: {retroRCorrecta: this.retroalimentacionRCorrecta, retroRUser: this.retroalimentacionRUser, imagePath: this.imagenesURL + imagen},
      autoFocus: false
    })
  }
}
