import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoginRegisterService } from '../../services/login-register.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public infoPerfil: Array<any> = []
  datosPerfil: UntypedFormGroup;
  
   constructor(private fb: UntypedFormBuilder, private loginRegisterService: LoginRegisterService) { 
    this.loginRegisterService.getPerfilUsuario().subscribe((resp: any) =>{ 
      this.infoPerfil.push(resp.body)
      this.tipoUsuario(this.infoPerfil[0].type)
    })
  }

  ngOnInit(): void {
    this.datosPerfil = this.fb.group({
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      password_confirmation: new UntypedFormControl('', [Validators.required, this.confirmationValidator]),
    });
  }

  tipoUsuario(userType: string){
    switch (userType) {
      case 'A':
        this.infoPerfil[0].type = 'Administrador'
        break;
      case 'S':
        this.infoPerfil[0].type = 'Profesor'
        break;
      case 'E':
        this.infoPerfil[0].type = 'Estudiante'
        break;
    }
  }

  editarDatosVista(userNAME: any, userEMAIL: any){
    this.datosPerfil.controls['name'].setValue(userNAME);
    this.datosPerfil.controls['email'].setValue(userEMAIL);

  }

  enviarEdicion(){

  }

  updateConfirmValidator(){
    
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.datosPerfil.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
