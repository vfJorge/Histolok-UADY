import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { AdminGruposService } from 'src/app/services/admin-grupos.service';
import { UserListService } from 'src/app/services/user-list.service';

@Component({
  selector: 'app-agregar-grupo',
  templateUrl: './agregar-grupo.component.html',
  styleUrls: ['./agregar-grupo.component.css']
})
export class AgregarGrupoComponent implements OnInit {
  datosGrupo!: FormGroup;
  keywords: Array<string> = [];
  misUsuarios: Array<any> = [];

  usuariosSeleccionados: Array<any> = [];
  constructor(private fb: FormBuilder, private adminGruposService: AdminGruposService, private userListService: UserListService) { }

  ngOnInit(): void {
    this.datosGrupo = this.fb.group({
      name: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      users: new FormControl('', [Validators.required])
    })

    this.userListService.getPerfilesUsuarios().subscribe((resp: any) => {
      this.misUsuarios = resp.body;

      console.log(this.misUsuarios);
    }, error => {
      console.log(error);
    })
  }

  crearGrupo(datosPreguntaAgregar: any){
    const formularioDatos = new FormData();
    this.usuariosSeleccionados =  this.usuariosSeleccionados.map(String);
    formularioDatos.append('name', this.datosGrupo.controls['name'].getRawValue())
    formularioDatos.append('desc', this.datosGrupo.controls['desc'].getRawValue())
    formularioDatos.append('users', JSON.stringify(this.usuariosSeleccionados));
    // this.datosExamen.controls['keywords'].setValue(JSON.stringify(this.keywords));
    // this.datosExamen.controls['questions'].setValue(JSON.stringify(this.preguntasSeleccionadas));
    
    this.adminGruposService.postCrearGrupo(formularioDatos).subscribe((resp: any) => {
      alert("El grupo ha sido creado con éxito");
      window.location.reload();
    }, error => {
      console.log(error);
      alert("No se pudo crear el grupo, inténtalo de nuevo");
    })
  }
  
 
  escogerUsuarios(event: any, usuarioID: number){
    if (event.target.checked) {
      this.usuariosSeleccionados.push(usuarioID);
    } else{
      const index = this.usuariosSeleccionados.indexOf(usuarioID);
      this.usuariosSeleccionados.splice(index, 1);
    }
  }
}
