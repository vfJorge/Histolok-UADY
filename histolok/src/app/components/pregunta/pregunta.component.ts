import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalImagenPreguntaComponent } from './modal-imagen-pregunta/modal-imagen-pregunta.component';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent implements OnInit {
  ImagenesURL = "http://127.0.0.1:8000/storage/";
  respuestaID: any;
  examenID: any; //La debe otorgar el clickear en iniciar examen
  misDatosExamen: any;
  preguntasFaltantes: any = -1;
  itemizacionOpciones = "vbtn-radio";
  tiempoInicial = "";
  tiempoSeleccion = "";
  examenTerminado = 0;
  respuestaSeleccionada: any;
  duracionExamen: any;


  hours: number; //Esto se guardará desde que acepte el examen y también iniciará en ese momento
  minutes: number;
  seconds: number;
  timer: any;
  date = new Date();

  
  public show: boolean = true;
  public disabled: boolean = false;
  public animate: boolean = false;
  @ViewChild("idAudio") idAudio: ElementRef;

  constructor(private adminExamenesService: AdminExamenesService,
    private adminQuestionsService: AdminQuestionsService,
    private adminImagesService: AdminImagesService,
    private dialog: MatDialog) {
      
  }

  ngOnInit(): void {
    this.duracionExamen = localStorage.getItem('TiempoExamen');
    this.examenID = localStorage.getItem('ExamenID');
    this.adminExamenesService.preguntaActualExamen(this.examenID).subscribe((resp: any) => {
      this.preguntasFaltantes = resp.body;
      this.misDatosExamen = resp.body.pregunta;
      console.log(this.preguntasFaltantes);
      console.log(this.misDatosExamen);
      }, error => {
      console.log(error);
    })
    
    this.setExamenTimer();
    this.start();
    this.iniciarTemporizador();
  }

  terminarExamen(){
    const datosExamen = new FormData();
    datosExamen.append('option_id', this.respuestaID);
    datosExamen.append('tiempo_inicio', this.tiempoInicial);
    datosExamen.append('tiempo_selec', this.tiempoSeleccion);
    datosExamen.append('tiempo_sig', this.formatDate(new Date()));
    this.adminExamenesService.sigPreguntaExamen(this.examenID, datosExamen).subscribe((resp: any) =>{
      localStorage.removeItem('TiempoExamen');
      window.location.reload();
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

  setExamenTimer(){
    this.hours = this.duracionExamen.split(':')[0]
    this.minutes = this.duracionExamen.split(':')[1]
    this.seconds = this.duracionExamen.split(':')[2]
  }

  iniciarTemporizador(){
    this.tiempoInicial = this.formatDate(new Date());
  }

  updateTimer() {
    localStorage.setItem('TiempoExamen', this.hours+':'+this.minutes+':'+this.seconds);
    this.date.setHours(this.hours);
    this.date.setMinutes(this.minutes);
    this.date.setSeconds(this.seconds);
    this.date.setMilliseconds(0);
    const time = this.date.getTime();
    this.date.setTime(time - 1000);  //---

    this.hours = this.date.getHours();
    this.minutes = this.date.getMinutes();
    this.seconds = this.date.getSeconds();

    if (this.date.getHours() === 0 &&
      this.date.getMinutes() === 0 &&
      this.date.getSeconds() === 0) {
      //stop interval
      clearInterval(this.timer);
      this.idAudio.nativeElement.play();
      this.animate = true;
      setTimeout(() => {
        this.stop();
        this.idAudio.nativeElement.load();
      }, 5000);

    }
  }

  start() {
    if (this.hours > 0 || this.minutes > 0 || this.seconds > 0) {

      this.disabled = true;
      this.updateTimer();

      if(this.seconds > 0){
        this.timer = setInterval(() => {
          this.updateTimer();
        }, 1000);
      }     
    }
  }

  stop() {    
    this.disabled = false;
    this.show = true;
    this.animate = false;
    clearInterval(this.timer);
    this.idAudio.nativeElement.load();
  }

  guardarRespuesta(seleccionID: any){
    this.respuestaSeleccionada = 1;
    this.respuestaID = seleccionID;
    this.tiempoSeleccion = this.formatDate(new Date());
    document.getElementById("botonEnviar").classList.remove("disabled");
  }

  mostrarImagen(imagen: any){
    this.dialog.open(ModalImagenPreguntaComponent, {
      height: '100%',
      width: '100%',
      data: {imagePath: this.ImagenesURL + imagen},
      autoFocus: false
    })
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
