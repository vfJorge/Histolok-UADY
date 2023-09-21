import { Component, OnInit } from '@angular/core';
import { UserListService } from 'src/app/services/user-list.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public listaUsuarios: Array<any> = [];
  listaUsuariosOriginal: Array<any> = [];
  busqueda: string = "";
  usuarioTipo: string ="";
  constructor(private userlistService: UserListService) {
    this.userlistService.getPerfilesUsuarios().subscribe((resp: any) => {
      this.listaUsuarios = resp.body;
      this.listaUsuariosOriginal = resp.body
    })
  }

  ngOnInit(): void {
    
  }
  
  ordenar(ordenamiento: string){
    switch(ordenamiento){
      case 'masReciente':
        this.listaUsuarios.sort((a , b) => new Date(b.email_verified_at).getTime() - new Date(a.email_verified_at).getTime());
        break;
      case 'masAntiguo':
        this.listaUsuarios.sort((a , b) => new Date(a.email_verified_at).getTime() - new Date(b.email_verified_at).getTime());
        break;
      case 'alfabet_AZ':
        this.listaUsuarios.sort((a , b) => a.name.toLowerCase().localeCompare( b.name.toLowerCase()));;
        break;
      case 'alfabet_ZA':
        this.listaUsuarios.sort((a , b) => b.name.toLowerCase().localeCompare( a.name.toLowerCase()));
        break;
      case 'tipoUsuario':
        this.listaUsuarios.sort((a , b) => a.type.localeCompare( b.type));
        break;
    }

  }
  buscarUsuario(){
    const search: string = this.busqueda.trim().toLowerCase();
  
    (search == "estudiante")? this.usuarioTipo = "E" :
    (search == "profesor") ? this.usuarioTipo = "S" :
    this.usuarioTipo = search;

    this.listaUsuarios = this.listaUsuariosOriginal.filter((usuario) =>
      usuario.name.toLowerCase().includes(search) ||
      usuario.email.toLowerCase().includes(search) ||
      usuario.type.includes(this.usuarioTipo)
        
    )
  }
}
