import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LoginRegisterService } from 'src/app/services/login-register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private loginRegisterService: LoginRegisterService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      password: new UntypedFormControl('', [Validators.required])
    });
  }

  submitForm(cuenta: any){
    if (this.validateForm.valid) {
      this.loginRegisterService.postIniciarSesion(cuenta).subscribe((resp: any) => {
        if(resp.status == 201){
          alert("Has iniciado sesión exitosamente");
          this.loginRegisterService.guardarToken(resp.body.token);
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("Credenciales inválidas, inténtalo de nuevo");
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
