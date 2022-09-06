import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AdminImagesService } from 'src/app/services/admin-images.service';

@Component({
  selector: 'app-agregar-img',
  templateUrl: './agregar-img.component.html',
  styleUrls: ['./agregar-img.component.css']
})
export class AgregarImgComponent implements OnInit {
  archivoCapturado: any;
  imgTitle: string = "";
  imgDesc: string = "";
  imgKeywords: string = "";
  imgPrivacy: boolean;
  imgAccess: string = "";
  accessToggle: string = "";

  constructor(private fb: FormBuilder, private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
  }

  getTitle(title: string){
    this.imgTitle = title;
  }

  getDesc(desc: string){
    this.imgDesc = desc;
  }

  getKeywords(keywords: string){
    this.imgKeywords = keywords;
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
    formularioDatos.append('title', this.imgTitle)
    formularioDatos.append('desc', this.imgDesc)
    formularioDatos.append('keywords', this.imgKeywords)
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
