import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoginRegisterService } from 'src/app/services/login-register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private loginRegisterService: LoginRegisterService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      password_confirmation: new UntypedFormControl('', [Validators.required, this.confirmationValidator]),
    });
  }

  submitForm(cuenta: any){
    if (this.validateForm.valid) {
      this.loginRegisterService.postCrearCuenta(cuenta).subscribe((resp: any) => {
        if(resp.status == 201){
          alert("Te has registrado exitosamente");
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

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.password_confirmation.updateValueAndValidity());
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
}
