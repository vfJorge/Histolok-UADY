import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';

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
  preguntasSeleccionadas: Array<any> = [];
  datosExamen!: FormGroup;

  constructor(private fb: FormBuilder,private adminExamenesService: AdminExamenesService, private adminQuestionsService: AdminQuestionsService) { }

  ngOnInit(): void {
    this.adminExamenesService.getMisExamenes().subscribe((resp: any) => {
      this.misExamenes = resp.body;
      this.misExamenesOriginal = resp.body;
      }, error => {
      console.log(error);
    })

    this.adminQuestionsService.getPreguntasPublicas().subscribe((resp: any) => {
      this.misPreguntas = resp.body;

      console.log(this.misPreguntas);
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
      ) ||
      examen.opcions.some(({opcion}: any) => 
        opcion.toLowerCase().includes(search)
      ) 
    )
  }
  
  
}
