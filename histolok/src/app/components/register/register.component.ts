import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRegisterService } from 'src/app/services/login-register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private LoginRegisterService: LoginRegisterService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      checkPassword: new FormControl('', [Validators.required, this.confirmationValidator]),
    });
  }

  submitForm(cuenta: any): boolean {
    if (this.validateForm.valid) {
      this.LoginRegisterService.postCrearCuenta(cuenta).subscribe((resp: any) => {
        if(resp.message == '¡Usuario registrado exitosamente!')
        alert("Te has registrado exitosamente");
        this.LoginRegisterService.postIniciarSesion(cuenta).subscribe((resp: any) => {
          this.LoginRegisterService.guardarToken(resp.access_token);
          window.location.reload();
          return true;
        })
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

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
}
