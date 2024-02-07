import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { ModalExamenComponent } from './modal-examen/modal-examen.component';
import { AdminImagesService } from '../../services/admin-images.service';
import { PATH_SERVER_IMGS } from 'src/app/serverconfig';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {
  public misExamenes: Array<any> = [];
  misExamenesOriginal: Array<any> = [];
  busqueda: string = "";
  misPreguntas: Array<any> = [];
  imagesPublic: Array<any> = [];
  preguntasSeleccionadas: Array<any> = [];
  datosExamen!: FormGroup;
  keywords: Array<string> = [];
  examenID: number;
  selectedQuestion = false;
  examenQuestions : Array<any> = [];
  datosExamenModal: Array<any> = [];
  imagenesURL = PATH_SERVER_IMGS
  imgFilename : string = "";

  constructor(private fb: FormBuilder, private adminExamenesService: AdminExamenesService,
     private adminQuestionsService: AdminQuestionsService, private dialog: MatDialog,
     private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.adminExamenesService.getMisExamenes().subscribe((resp: any) => {
      this.misExamenes = resp.body;
      this.misExamenesOriginal = resp.body;
      console.log(this.misExamenes);
      }, error => {
      console.log(error);
    })

    this.adminQuestionsService.getPreguntasPublicas().subscribe((resp: any) => {
      this.misPreguntas = resp.body;
    }, error => {
      console.log(error);
    })
  
    this.adminImagesService.getImagenesPublic().subscribe((resp: any) => {
      this.imagesPublic = resp.body;
    }, error => {
     console.log(error);
    })

    this.datosExamen = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      keywords: new FormControl('', [Validators.required]),
      access: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      difficulty: new FormControl('', [Validators.required]),
      questions: new FormControl('', [Validators.required])  
    })
  }

  buscarExamen(){
    const search: string = this.busqueda.trim().toLowerCase();
    this.misExamenes = this.misExamenesOriginal.filter((examen) =>
      examen.title.toLowerCase().includes(search) ||
      examen.difficulty.toString().includes(search) ||
      examen.palabclvs.some(({keyword}: any) => 
        keyword.toLowerCase().includes(search)
      )
    )
  }

  editarExamenVista(examenID: any, examenTITLE: any, examenDESCRIPTION: any,
  examenKEYWORDS: any, examenACCESS: any, examenDIFFICULTY: any, examenDURATION: any){
    this.keywords = [];
    this.examenQuestions = [];
    this.examenID = examenID;
    this.preguntasSeleccionadas = [];

    this.adminExamenesService.verExamen(examenID).subscribe((resp: any) => {
      this.examenQuestions = resp.body.preguntas;
      for (let i = 0; i < this.examenQuestions.length; i++) {
        if (this.preguntasSeleccionadas.indexOf((this.examenQuestions[i].id).toString())==-1) {
          this.preguntasSeleccionadas.push((this.examenQuestions[i].id).toString());
        }
      }
      }, error => {
      console.log(error);
    });
    
    this.datosExamen.controls['title'].setValue(examenTITLE);
    this.datosExamen.controls['description'].setValue(examenDESCRIPTION);
    
    for(var i in examenKEYWORDS) this.keywords.push(examenKEYWORDS[i].keyword);
   
    if(examenACCESS == "public"){
      this.datosExamen.controls['access'].setValue("public");
      
    }
    else{
      this.datosExamen.controls['access'].setValue("private");
    }

    this.datosExamen.controls['difficulty'].setValue(examenDIFFICULTY);
    this.datosExamen.controls['duration'].setValue(examenDURATION);
  }

  enviarEdicion(){
    this.datosExamen.controls['keywords'].setValue(JSON.stringify(this.keywords));
    this.datosExamen.controls['questions'].setValue(JSON.stringify(this.preguntasSeleccionadas));
    // const formularioDatos = new FormData();

    // formularioDatos.append('title', this.datosExamen.controls['title'].value);
    // formularioDatos.append('question', this.datosExamen.controls['questions'].value);
    // formularioDatos.append('description', this.datosExamen.controls['description'].value);
    // formularioDatos.append('keywords', this.datosExamen.controls['keywords'].value);
    // formularioDatos.append('duration', this.datosExamen.controls['duration'].value);
    // formularioDatos.append('access', this.datosExamen.controls['access'].value);
    // formularioDatos.append('difficulty', this.datosExamen.controls['difficulty'].value);
    
    this.adminExamenesService.editarExamen(this.datosExamen.value, this.examenID).subscribe((resp: any) => {
      if(resp.status == 200){
        alert("Examen editado de manera exitosa");
        window.location.reload();
      }
    }, error => {
      console.log(error);
      alert("No se pudo editar el examen, inténtalo de nuevo");
    })
      
  }
  
  eliminarExamen(examenID: any){
    this.adminExamenesService.eliminarExamen(examenID).subscribe((resp: any) => {
      if(resp.status == 200){
        alert("Examen eliminado de manera exitosa");
        window.location.reload();
      }
    }, error => {
      console.log(error);
      alert("No se pudo eliminar el examen, inténtalo de nuevo");
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

    escogerPreguntas(event: any, preguntaID: number){
      if (event.target.checked) {
        this.preguntasSeleccionadas.push(preguntaID.toString());
      } else{
        const index = this.preguntasSeleccionadas.indexOf(preguntaID.toString());
        this.preguntasSeleccionadas.splice(index, 1);
      }
    }
   
    isSelected(preguntaID: number){
      return this.preguntasSeleccionadas.includes(preguntaID.toString());
    }
    
    mostrarExamen(examen: any){
      var imgsDatos: Array<any> = [];
      
      this.adminExamenesService.verExamen(examen.id).subscribe((resp: any) => {
        for (let i = 0; i < resp.body.preguntas.length; i++) {
          var imgs = new Object();
          imgs = {
            id: resp.body.preguntas[i].id,
            img: this.getImagen(resp.body.preguntas[i].id)
          }
          imgsDatos.push(imgs);
        }
        console.log(imgsDatos);
        this.dialog.open(ModalExamenComponent, {
          height: '550px',
          width: '500px',
          data: {title: examen.title, questions: resp.body.preguntas, imagePaths: imgsDatos},
          autoFocus: false
        })
        console.log(resp.body.preguntas)
      }, error => {
        console.log(error);
      });
    }


    getImagen(preguntaID: any){
      var imgFilename = "";
      for (let i = 0; i < this.imagesPublic.length; i++) {
        if (this.imagesPublic[i].id == preguntaID) {
          imgFilename = this.imagenesURL + this.imagesPublic[i].filename;  
        }
      }
      return imgFilename;
    }

}
