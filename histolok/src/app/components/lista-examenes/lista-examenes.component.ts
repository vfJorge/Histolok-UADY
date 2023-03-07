import { Component, OnInit } from '@angular/core';
import { AdminExamenesService } from 'src/app/services/admin-examenes.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';
import { AdminImagesService } from '../../services/admin-images.service';

@Component({
  selector: 'app-lista-examenes',
  templateUrl: './lista-examenes.component.html',
  styleUrls: ['./lista-examenes.component.css']
})
export class ListaExamenesComponent implements OnInit {
  //LISTA DE EXAMENES DISPONIBLES PARA PRACTICAR
  public misExamenes: Array<any> = [];
  misExamenesOriginal: Array<any> = [];
  busqueda: string = "";
  misDatosExamen: any;

  constructor(private adminExamenesService: AdminExamenesService,
    private adminQuestionsService: AdminQuestionsService,
    private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.adminExamenesService.getExamenesPublicos().subscribe((resp: any) => {
      this.misExamenes = resp.body;
      this.misExamenesOriginal = resp.body;
      console.log(this.misExamenes);
      }, error => {
      console.log(error);
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

  iniciarExamen(examenID: any){
    localStorage.setItem('ExamenID', examenID);

    this.adminExamenesService.verExamen(examenID).subscribe((resp: any) => {
      localStorage.setItem('TiempoExamen', resp.body.duration);
      }, error => {
      console.log(error);
    })

    this.adminExamenesService.empezarExamen(examenID).subscribe((resp: any) => {
      this.misDatosExamen = resp.body;
      console.log(this.misDatosExamen);
      window.location.reload();
      }, error => {
      console.log(error);
    })
  }
}
