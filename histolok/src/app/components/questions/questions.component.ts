import { Component, OnInit } from '@angular/core';
import { LoginRegisterService } from '../../services/login-register.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  public misPreguntas: Array<any> = [];
  public misImagenes: Array<any> = [];
  imagenesURL = "http://127.0.0.1:8000/storage/";
  perfilUsuario: string = "";
  esEstudiante: boolean;
  datosPreguntas!: FormGroup;

  preguntaID: any;
  opcionesi: any = 0;
  auxOpciones: any = 1;

  busqueda: string = "";
  misPreguntasOriginal: Array<any> = [];
  keywords: Array<string> = [];
  
  constructor(private adminQuestionsService: AdminQuestionsService,
    private loginRegisterService : LoginRegisterService,
    private adminImagesService: AdminImagesService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.adminQuestionsService.getMisPreguntas().subscribe((resp: any) => {
      this.misPreguntas = resp.body;
      this.misPreguntasOriginal = resp.body;
      console.log(this.misPreguntas);
    }, error => {
      console.log(error);
    })

    this.adminImagesService.getImagenesPublic().subscribe((resp: any) => {
      this.misImagenes = resp.body;
    }, error => {
     console.log(error);
    })

    this.datosPreguntas = this.fb.group({
      title: new FormControl('', [Validators.required]),
      question: new FormControl('', [Validators.required]),
      keywords: new FormControl('', [Validators.required]),
      answer: new FormControl('', [Validators.required]),
      option1: new FormControl('', [Validators.required]),
      option2: new FormControl(' ', [Validators.required]),
      option3: new FormControl('  ', [Validators.required]),
      access: new FormControl('', [Validators.required]),
      difficulty: new FormControl('', [Validators.required]),
      foto_id: new FormControl('')
    })
  }

  //Inicio Keywords con Chips
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.keywords.push(value);
    }

    event.chipInput!.clear();
  }
  
  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }
  //Fin Keywords con Chips

  eliminarPregunta(preguntaID: any){
    this.adminQuestionsService.delEliminarPregunta(preguntaID).subscribe((resp: any) => {
      if(resp.status == 200){
        alert("Pregunta eliminada de manera exitosa");
        window.location.reload();
      }
    }, error => {
      console.log(error);
      alert("No se pudo eliminar la pregunta, inténtalo de nuevo");
    })
  }

  getPerfilUsuario(){
    this.perfilUsuario == 'E' ? this.esEstudiante = true : this.esEstudiante = false;
    return this.esEstudiante;
  }

  editarPreguntaVista(preguntaID: any, preguntaTITLE: any, preguntaQUESTION: any, preguntaKEYWORDS: any, preguntaANSWERID: any,
    preguntaOPCIONS: any, preguntaACCESS: any, preguntaDIFFICULTY: any, preguntaFOTOID: any){
    this.keywords = [];

    this.preguntaID = preguntaID;

    this.datosPreguntas.controls['title'].setValue(preguntaTITLE);
    this.datosPreguntas.controls['question'].setValue(preguntaQUESTION);
    
    for(var i in preguntaKEYWORDS) this.keywords.push(preguntaKEYWORDS[i].keyword);

    this.auxOpciones = 1;
    for(this.opcionesi; this.opcionesi < preguntaOPCIONS.length; this.opcionesi++){
      if(preguntaOPCIONS[this.opcionesi].id == preguntaANSWERID){
        this.datosPreguntas.controls['answer'].setValue(preguntaOPCIONS[this.opcionesi].opcion);
      }
      else{
        this.datosPreguntas.controls['option'+this.auxOpciones].setValue(preguntaOPCIONS[this.opcionesi].opcion);
        this.auxOpciones++;
      }
    }

    if(preguntaACCESS == "public"){
      this.datosPreguntas.controls['access'].setValue("public");
      
    }
    else{
      this.datosPreguntas.controls['access'].setValue("private");
    }

    this.datosPreguntas.controls['difficulty'].setValue(preguntaDIFFICULTY);
    this.datosPreguntas.controls['foto_id'].setValue(preguntaFOTOID);
  }

  enviarEdicion(datosPreguntas: any){
    this.datosPreguntas.controls['keywords'].setValue(JSON.stringify(this.keywords))
      this.adminQuestionsService.putEditarPregunta(datosPreguntas, this.preguntaID).subscribe((resp: any) => {
        if(resp.status == 200){
          alert("Pregunta editada de manera exitosa");
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("No se pudo editar la pregunta, inténtalo de nuevo");
      })
  }

  escogerImagenEdicion(FotoID: any){
    this.datosPreguntas.controls['foto_id'].setValue(FotoID);
  }

  buscarPregunta(){
    const search: string = this.busqueda.trim().toLowerCase();
    this.misPreguntas = this.misPreguntasOriginal.filter((pregunta) =>
      pregunta.title.toLowerCase().includes(search) ||
      pregunta.question.toLowerCase().includes(search) ||
      pregunta.difficulty.toString().includes(search) ||
      pregunta.palabclvs.some(({keyword}: any) => 
        keyword.toLowerCase().includes(search)
      ) ||
      pregunta.opcions.some(({opcion}: any) => 
        opcion.toLowerCase().includes(search)
      ) 
    )
  }

  ordenar(ordenamiento: string){
    switch(ordenamiento){
      case 'porTitulo':
        this.misPreguntas.sort((a , b) => a.title.toLowerCase().localeCompare( b.title.toLowerCase()));;
        break;
      case 'porPregunta':
        this.misPreguntas.sort((a , b) => a.question.toLowerCase().localeCompare( b.question.toLowerCase()));;
        break;
    }
  }
}
