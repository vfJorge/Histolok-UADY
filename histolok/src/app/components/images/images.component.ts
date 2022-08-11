import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';

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
  busqueda: string = "";
  misImagenesOriginal: Array<any> = [];

  constructor(
    private adminImagesService: AdminImagesService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // this.adminImagesService.getMisImagenes().subscribe((resp: any) => {
    //   this.misImagenes = resp.body;
    //   console.log(resp.body)
    // }, error => {
    //   console.log(error);
    // })

    //Seccion para cuando se deban mostrar todas las imagenes 
      this.adminImagesService.VerTodas().subscribe((resp: any) => {
      this.misImagenes = resp.body;
      this.misImagenesOriginal = resp.body;
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

  ordenar(ordenamiento: string){
    switch(ordenamiento){
      case 'masReciente':
        this.misImagenes.sort((a , b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'masAntiguo':
        this.misImagenes.sort((a , b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'alfabet_AZ':
        this.misImagenes.sort((a , b) => a.user.name.toLowerCase().localeCompare( b.user.name.toLowerCase()));;
        break;
      case 'alfabet_ZA':
        this.misImagenes.sort((a , b) => b.user.name.toLowerCase().localeCompare( a.user.name.toLowerCase()));
        break;
    }
  }

  buscarImagen(){
    const search: string = this.busqueda.trim().toLowerCase();
  
    this.misImagenes = this.misImagenesOriginal.filter((imagen) =>
      imagen.title.toLowerCase().includes(search) ||
      imagen.user.name.toLowerCase().includes(search) ||
      imagen.originalName.toLowerCase().includes(search) ||
      imagen.palabclvs.some(({keyword}: any) => 
        keyword.toLowerCase().includes(search)
      )
    )
  }

  mostrarImagen(imagen: any){
    this.dialog.open(ModalImagenComponent, {
      height: '600px',
      width: '900px',
      data: {imagePath: this.imagenesURL + imagen.filename, title: imagen.title, description: imagen.desc},
      autoFocus: false
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
