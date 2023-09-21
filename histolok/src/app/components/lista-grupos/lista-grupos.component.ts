import { Component, OnInit } from '@angular/core';
import { AdminGruposService } from 'src/app/services/admin-grupos.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserListService } from 'src/app/services/user-list.service';

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
  datosGrupo!: FormGroup;
  grupoID: any;
  usuariosSeleccionados: Array<any> = [];
  groupUsers: any;
  misUsuarios: any;

  constructor(private adminGruposService: AdminGruposService, private dialog: MatDialog,
    private fb: FormBuilder, private userListService: UserListService) { }

  ngOnInit(): void {
    this.adminGruposService.getMisGrupos().subscribe((resp: any) => {
      this.misGrupos = resp.body;
      this.misGruposOriginal = resp.body;
      console.log(this.misGrupos);
      }, error => {
      console.log(error);
    })

    this.userListService.getPerfilesUsuarios().subscribe((resp: any) => {
      this.misUsuarios = resp.body;

      console.log(this.misUsuarios);
    }, error => {
      console.log(error);
    })

    this.datosGrupo = this.fb.group({
      name: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      users: new FormControl('', [Validators.required])
    })
  }

  

  buscarGrupo(){ //PROBAR FILTRO PARA GRUPOS
    const search: string = this.busqueda.trim().toLowerCase();
    this.misGrupos = this.misGruposOriginal.filter((grupo) =>
      grupo.name.toLowerCase().includes(search)
    )
  }

  eliminarGrupo(grupoID: any){
    this.adminGruposService.eliminarGrupo(grupoID).subscribe((resp: any) => {
      if(resp.status == 200){
        alert("Examen eliminado de manera exitosa");
        window.location.reload();
      }
    }, error => {
      console.log(error);
      alert("No se pudo eliminar el examen, inténtalo de nuevo");
    })
  }

  editarGrupoVista(grupoID: any, grupoNAME: any, grupoDESCRIPTION: any){
    this.datosGrupo.controls['name'].setValue(grupoNAME);
    this.datosGrupo.controls['desc'].setValue(grupoDESCRIPTION);
    this.usuariosSeleccionados = [];
  
      this.adminGruposService.getGrupo(grupoID).subscribe((resp: any) => {
        console.log(resp.body)
        this.groupUsers = resp.body.users;
        for (let i = 0; i < this.groupUsers.length; i++) {
          if (this.usuariosSeleccionados.indexOf((this.groupUsers[i].id).toString())==-1) {
            this.usuariosSeleccionados.push((this.groupUsers[i].id).toString());
          }
        }
        }, error => {
        console.log(error);
      });
      
    }
  
    enviarEdicion(){
      this.datosGrupo.controls['users'].setValue(JSON.stringify(this.usuariosSeleccionados));
      
      this.adminGruposService.editarGrupo(this.datosGrupo.value, this.grupoID).subscribe((resp: any) => {
        if(resp.status == 200){
          alert("Grupo editado de manera exitosa");
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("No se pudo editar el grupo, inténtalo de nuevo");
      })
        
    }

    isSelected(usuarioID: number){
      return this.usuariosSeleccionados.includes(usuarioID.toString());
    }

    escogerUsuarios(event: any, usuarioID: number){
      if (event.target.checked) {
        this.usuariosSeleccionados.push(usuarioID);
      } else{
        const index = this.usuariosSeleccionados.indexOf(usuarioID);
        this.usuariosSeleccionados.splice(index, 1);
      }
    }

    verGrupo(grupoID: any){
      localStorage.setItem('grupoID', grupoID);
    }
}
