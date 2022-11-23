import { Component, OnInit } from '@angular/core';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from 'src/app/services/admin-images.service';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent implements OnInit {
  raizImagenes = "http://127.0.0.1:8000/storage/";
  respuestaID: any;
  examenID = 1;
  misDatosExamen: any;
  ImagenesURL = "";
  itemizacionOpciones = "vbtn-radio";
  tiempoInicial = "";
  tiempoSeleccion = "";
  examenTerminado = 0;

  constructor(private adminExamenesService: AdminExamenesService,
    private adminQuestionsService: AdminQuestionsService,
    private adminImagesService: AdminImagesService) {
      
  }

  ngOnInit(): void {
    this.adminExamenesService.preguntaActualExamen(this.examenID).subscribe((resp: any) => {
      this.misDatosExamen = resp.body;
      console.log(resp.status)
      console.log(this.misDatosExamen);
      }, error => {
      console.log(error);
    })

    if(this.tiempoInicial == ""){ //TIENE QUE SER DESDE QUE PRESIONE EL BOTON EN LISTA-EXAMENES

    }

    this.adminImagesService.getInfoImagen(this.misDatosExamen.foto_id).subscribe((resp: any) => {
      this.ImagenesURL = this.raizImagenes + resp.body.filename;
      console.log(this.ImagenesURL);
      }, error => {
      console.log(error);
    })
  }

  siguientePregunta(){
    const datosExamen = new FormData();
    datosExamen.append('option_id', this.respuestaID);
    datosExamen.append('tiempo_inicio', this.tiempoInicial);
    datosExamen.append('tiempo_selec', this.tiempoSeleccion);
    datosExamen.append('tiempo_sig', this.formatDate(new Date()));
    this.adminExamenesService.sigPreguntaExamen(this.examenID, datosExamen).subscribe((resp: any) =>{
      window.location.reload()
    })
  }

  iniciarTemporizador(){
    this.tiempoInicial = this.formatDate(new Date());
  }


  guardarRespuesta(seleccionID: any){
    this.respuestaID = seleccionID;
    this.tiempoSeleccion = this.formatDate(new Date());
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  
  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
}
