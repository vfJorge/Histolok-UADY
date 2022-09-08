import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-agregar-img',
  templateUrl: './agregar-img.component.html',
  styleUrls: ['./agregar-img.component.css']
})
export class AgregarImgComponent implements OnInit {
  archivoCapturado: any;
  imgPrivacy: boolean;
  imgAccess: string = "";
  accessToggle: string = "";
  datosImagenes!: FormGroup;
  keywords: Array<string> = [];

  constructor(private fb: FormBuilder, private adminImagesService: AdminImagesService) {
  }

  //Inicio Keywords con Chips
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.keywords.push(value);
    }

    event.chipInput!.clear();
  }
  
  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }
  //Fin Keywords con Chips

  ngOnInit(): void {
    this.datosImagenes = this.fb.group({
      title: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      access: new FormControl(this.imgAccess)
    })
  }
  capturarFile(event: any): any{
    this.archivoCapturado = event.target.files[0]
    if (this.imgAccess == "" ){
      this.imgAccess = "private" 
    } 
  }

  getPrivacy(){
    this.imgPrivacy == false ? this.imgAccess = "private": this.imgAccess = "public"
    this.imgPrivacy == true ? this.accessToggle = "pública" : this.accessToggle = "privada";
  }

  submitForm(){
    const formularioDatos = new FormData();
    formularioDatos.append('title', this.datosImagenes.controls['title'].getRawValue())
    formularioDatos.append('desc', this.datosImagenes.controls['desc'].getRawValue())
    formularioDatos.append('keywords', JSON.stringify(this.keywords))
    formularioDatos.append('image', this.archivoCapturado)
    formularioDatos.append('access', this.imgAccess)
      this.adminImagesService.postAgregarImagen(formularioDatos).subscribe((resp: any) => {
        if(resp.status == 201){
          alert("Imagen agregada de manera exitosa");
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("No se pudo agregar la imagen, inténtalo de nuevo");
      })
  }
}
