import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminImagesService } from 'src/app/services/admin-images.service';

@Component({
  selector: 'app-agregar-img',
  templateUrl: './agregar-img.component.html',
  styleUrls: ['./agregar-img.component.css']
})
export class AgregarImgComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submitForm(cuenta: any){
    if (this.validateForm.valid) {
      this.adminImagesService.postAgregarImagen(cuenta).subscribe((resp: any) => {
        if(resp.status == 201){
          alert("Imagen agregada de manera exitosa");
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("No se pudo agregar la imagen, inténtalo de nuevo");
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
