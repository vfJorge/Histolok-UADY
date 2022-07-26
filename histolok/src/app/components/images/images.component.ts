import { Component, OnInit } from '@angular/core';
import { AdminImagesService } from 'src/app/services/admin-images.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  public misImagenes: Array<any> = [];
  imagenesURL = "http://127.0.0.1:8000/storage/";
  archivoCapturado: any;
  imgTitle: string = "";
  imgDesc: string = "";
  imgKeywords: string = "";
  imgID: any;

  constructor(private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.adminImagesService.getMisImagenes().subscribe((resp: any) => {
      this.misImagenes = resp.body;
      console.log(resp.body)
    }, error => {
      console.log(error);
    })
  }

  eliminarImagen(imagenID: any){
    this.adminImagesService.delEliminarImagen(imagenID).subscribe((resp: any) => {
      if(resp.status == 200){
        alert("Imagen eliminada de manera exitosa");
        window.location.reload();
      }
    }, error => {
      console.log(error);
      alert("No se pudo eliminar la imagen, inténtalo de nuevo");
    })
  }
  
  editarImagenVista(imagenID: any, imagenTITLE: any, imagenDESC: any, imagenKEYWORDS: any){
    this.imgID = imagenID;
    (<HTMLInputElement>document.getElementById("titulo")).value = imagenTITLE;
    (<HTMLInputElement>document.getElementById("descripcion")).value = imagenDESC;
    (<HTMLInputElement>document.getElementById("palabclv")).value = imagenKEYWORDS[0].keyword;
  }

  enviarEdicion(){
    const formularioDatos = new FormData();
    formularioDatos.append('title', this.imgTitle)
    formularioDatos.append('desc', this.imgDesc)
    formularioDatos.append('keywords', this.imgKeywords)
    formularioDatos.append('image', this.archivoCapturado)
      this.adminImagesService.putEditarImagen(formularioDatos, this.imgID).subscribe((resp: any) => {
        if(resp.status == 200){
          alert("Imagen editada de manera exitosa");
          window.location.reload();
        }
      }, error => {
        console.log(error);
        alert("No se pudo editar la imagen, inténtalo de nuevo");
      })
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
}
