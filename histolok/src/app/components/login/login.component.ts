import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginRegisterService } from 'src/app/services/login-register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private LoginRegisterService: LoginRegisterService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submitForm(cuenta: any): boolean {
    if (this.validateForm.valid) {
      this.LoginRegisterService.postIniciarSesion(cuenta).subscribe((resp: any) => {
        alert("Has iniciado sesión exitosamente");
        this.LoginRegisterService.guardarToken(resp.access_token);
        window.location.reload();
        return true;
      }, error => {
        console.log(error);
        alert("Credenciales inválidas, inténtalo de nuevo");
        return false;
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    return false;
  }
}
