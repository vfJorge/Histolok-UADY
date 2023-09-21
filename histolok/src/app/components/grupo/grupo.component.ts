import { Component, OnInit } from '@angular/core';
import { AdminGruposService } from 'src/app/services/admin-grupos.service';
import { UserListService } from 'src/app/services/user-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalResultadosAlumnoComponent } from './modal-resultados-alumno/modal-resultados-alumno.component';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  public infoGrupo: Array<any> = []
  grupoID: any;
  public listaUsuarios: Array<any> = [];
  listaUsuariosOriginal: Array<any> = [];
  busqueda: string = "";
  retroInfo: Array<any> = [];

  constructor(private adminGruposService: AdminGruposService, private userlistService: UserListService,
    private dialog: MatDialog) {
    this.grupoID = localStorage.getItem('grupoID');
    this.adminGruposService.getGrupo(this.grupoID).subscribe((resp: any) =>{ 
      this.infoGrupo.push(resp.body)
      this.listaUsuarios = resp.body.users;
      this.listaUsuariosOriginal = resp.body.users;
      console.log(this.infoGrupo);
    });
    
  }

  ngOnInit(): void {
  }

  ordenar(ordenamiento: string){
    switch(ordenamiento){
      case 'alfabet_AZ':
        this.listaUsuarios.sort((a , b) => a.name.toLowerCase().localeCompare( b.name.toLowerCase()));;
        break;
      case 'alfabet_ZA':
        this.listaUsuarios.sort((a , b) => b.name.toLowerCase().localeCompare( a.name.toLowerCase()));
        break;
    }

  }

  buscarUsuario(){
    const search: string = this.busqueda.trim().toLowerCase();

    this.listaUsuarios = this.listaUsuariosOriginal.filter((usuario) =>
      usuario.name.toLowerCase().includes(search) ||
      usuario.email.toLowerCase().includes(search)
        
    )
  }

  mostrarResultados(userID: any){
    //this.retroInfo = [];
    this.adminGruposService.getResultadosAlumno(userID).subscribe((resp: any) =>{
      this.dialog.open(ModalResultadosAlumnoComponent, {
        height: '90%',
        width: '50%',
        data:  resp.body.resultados, //calificacion: this.retroInfo, fueCompletado: this.retroInfo, nCorrectas: this.retroInfo, duracion: this.retroInfo, fecha: this.retroInfo 
        autoFocus: false
      })
      console.log(resp.body.resultados);
    });
    
    
  }
}
