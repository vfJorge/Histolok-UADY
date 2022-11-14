import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-agregar-question',
  templateUrl: './agregar-question.component.html',
  styleUrls: ['./agregar-question.component.css']
})
export class AgregarQuestionComponent implements OnInit {
  public misImagenes: Array<any> = [];
  imagenesURL = "http://127.0.0.1:8000/storage/";
  datosPreguntaAgregar!: FormGroup;
  keywords: Array<string> = [];
  existeImg: boolean = false;
  imgFilename: string = '';
  imgOriginalName: string = '';
  constructor(private fb: FormBuilder, private adminQuestionsService: AdminQuestionsService, private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.datosPreguntaAgregar = this.fb.group({
      title: new FormControl('', [Validators.required]),
      question: new FormControl('', [Validators.required]),
      keywords: new FormControl('', [Validators.required]),
      answer: new FormControl('', [Validators.required]),
      option1: new FormControl('', [Validators.required]),
      option2: new FormControl('', [Validators.required]),
      option3: new FormControl('', [Validators.required]),
      access: new FormControl('', [Validators.required]),
      difficulty: new FormControl('', [Validators.required]),
      foto_id: new FormControl('')
    })

    this.adminImagesService.getImagenesPublic().subscribe((resp: any) => {
      this.misImagenes = resp.body;
      console.log(resp.body);
    }, error => {
     console.log(error);
    })
  }

  agregarPregunta(datosPreguntaAgregar: any){
    this.datosPreguntaAgregar.controls.keywords.patchValue( JSON.stringify(this.keywords));
    this.adminQuestionsService.postAgregarPregunta(datosPreguntaAgregar).subscribe((resp: any) => {
      alert("La pregunta se ha añadido con éxito");
      window.location.reload();
    }, error => {
      console.log(error);
      alert("No se pudo agregar la pregunta, inténtalo de nuevo");
    })
  }
  
  escogerImagen(idImagen: any){
    this.datosPreguntaAgregar.controls.keywords.patchValue( JSON.stringify(this.keywords));
    this.datosPreguntaAgregar.controls.foto_id.patchValue(idImagen);
    this.getFilename(idImagen);
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
 
  getFilename(imgID: String){
    for (let i = 0; i < this.misImagenes.length; i++) {
      if (this.misImagenes[i].id == imgID){
        this.imgFilename = this.imagenesURL + this.misImagenes[i].filename;   
        this.imgOriginalName = this.misImagenes[i].originalName;
      }
    }

  }
}
