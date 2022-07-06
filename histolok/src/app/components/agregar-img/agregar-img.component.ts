import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminImagesService } from 'src/app/services/admin-images.service';

@Component({
  selector: 'app-agregar-img',
  templateUrl: './agregar-img.component.html',
  styleUrls: ['./agregar-img.component.css']
})
export class AgregarImgComponent implements OnInit {
  imageForm!: FormGroup;

  constructor(private fb: FormBuilder, private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.imageForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      keywords: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required])
    });
  }

  submitForm(fotoAdd: any){
    if (this.imageForm.valid) {
      this.adminImagesService.postAgregarImagen(fotoAdd).subscribe((resp: any) => {
        if(resp.status == 201){
          alert("Imagen agregada de manera exitosa");
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("No se pudo agregar la imagen, inténtalo de nuevo");
      })
    } else {
      Object.values(this.imageForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
