import { Component, OnInit } from '@angular/core';
import { AdminGruposService } from 'src/app/services/admin-grupos.service';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit {
  //LISTA DE GRUPOS
  public misGrupos: Array<any> = [];
  misGruposOriginal: Array<any> = [];
  busqueda: string = "";
  misDatosGrupos: any;

  constructor(private adminGruposService: AdminGruposService) { }

  ngOnInit(): void {
    this.adminGruposService.getMisGrupos().subscribe((resp: any) => {
      this.misGrupos = resp.body;
      this.misGruposOriginal = resp.body;
      console.log(this.misGrupos);
      }, error => {
      console.log(error);
    })
  }

  

  buscarGrupo(){ //CAMBIAR EL FILTRO PARA QUE SIRVA EN GRUPOS
    const search: string = this.busqueda.trim().toLowerCase();
    this.misGrupos = this.misGruposOriginal.filter((examen) =>
      examen.title.toLowerCase().includes(search) ||
      examen.difficulty.toString().includes(search) ||
      examen.palabclvs.some(({keyword}: any) => 
        keyword.toLowerCase().includes(search)
      )
    )
  }
}
