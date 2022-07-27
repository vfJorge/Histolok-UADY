import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  }

  submitForm(){
    const formularioDatos = new FormData();
    formularioDatos.append('title', this.imgTitle)
    formularioDatos.append('desc', this.imgDesc)
    formularioDatos.append('keywords', this.imgKeywords)
    formularioDatos.append('image', this.archivoCapturado)
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
