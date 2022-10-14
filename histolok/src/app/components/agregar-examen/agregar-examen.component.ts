import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { AdminQuestionsService } from '../../services/admin-questions.service';
import { AdminExamenesService } from '../../services/admin-examenes.service';

@Component({
  selector: 'app-agregar-examen',
  templateUrl: './agregar-examen.component.html',
  styleUrls: ['./agregar-examen.component.css']
})
export class AgregarExamenComponent implements OnInit {
  datosExamen!: FormGroup;
  keywords: Array<string> = [];
  misPreguntas: Array<any> = [];

  preguntasSeleccionadas: Array<any> = [];
  constructor(private fb: FormBuilder, private adminQuestionsService: AdminQuestionsService, private adminExamenesService: AdminExamenesService) { }

  ngOnInit(): void {
    this.datosExamen = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      keywords: new FormControl('', [Validators.required]),
      access: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      difficulty: new FormControl('', [Validators.required]),
      questions: new FormControl('')  
    })

    this.adminQuestionsService.getPreguntasPublicas().subscribe((resp: any) => {
      this.misPreguntas = resp.body;

      console.log(this.misPreguntas);
    }, error => {
      console.log(error);
    })
  }

  crearExamen(datosPreguntaAgregar: any){
    const formularioDatos = new FormData();
    formularioDatos.append('title', this.datosExamen.controls['title'].getRawValue())
    formularioDatos.append('description', this.datosExamen.controls['description'].getRawValue())
    formularioDatos.append('keywords', JSON.stringify(this.keywords))
    formularioDatos.append('access', this.datosExamen.controls['access'].getRawValue())
    formularioDatos.append('duration', this.datosExamen.controls['duration'].getRawValue())
    formularioDatos.append('difficulty', this.datosExamen.controls['difficulty'].getRawValue())
    formularioDatos.append('questions', JSON.stringify(this.preguntasSeleccionadas))
    // this.datosExamen.controls['keywords'].setValue(JSON.stringify(this.keywords));
    // this.datosExamen.controls['questions'].setValue(JSON.stringify(this.preguntasSeleccionadas));
    console.log(this.preguntasSeleccionadas);
    this.adminExamenesService.postCrearExamen(formularioDatos).subscribe((resp: any) => {
      alert("El examen ha sido creado con éxito");
      window.location.reload();
    }, error => {
      console.log(error);
      alert("No se pudo crear el examen, inténtalo de nuevo");
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
      this.preguntasSeleccionadas.push(preguntaID);
    } else{
      const index = this.preguntasSeleccionadas.indexOf(preguntaID);
      this.preguntasSeleccionadas.splice(index, 1);
    }
  }
}
