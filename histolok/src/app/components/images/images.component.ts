import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminImagesService } from 'src/app/services/admin-images.service';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  public misImagenes: Array<any> = [];
  imagenesURL = "http://127.0.0.1:8000/storage/";
  archivoCapturado: any;
  imgID: any;
  imgPrivacy: boolean;
  imgAccess: string = "";
  accessToggle: string = "";
  busqueda: string = "";
  
  misImagenesOriginal: Array<any> = [];
  perfilUsuario: string = "";
  esEstudiante: boolean;
  datosImagenes!: FormGroup;
  keywords: Array<string> = [];

  constructor(private adminImagesService: AdminImagesService, private dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.adminImagesService.getMisImagenes().subscribe((resp: any) => {
      this.misImagenes = resp.body;
      this.misImagenesOriginal = resp.body;
      console.log(resp.body);
    }, error => {
     console.log(error);
    })
  
    this.datosImagenes = this.fb.group({
      title: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required])
    })
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

  getPrivacidad(){
    this.imgPrivacy == false ? this.imgAccess = "private": this.imgAccess = "public"
    this.imgPrivacy == true ? this.accessToggle = "pública" : this.accessToggle = "privada";
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
  
  editarImagenVista(imagenID: any, imagenTITLE: any, imagenDESC: any, imagenKEYWORDS: any, access: any){
    this.keywords = [];

    this.imgID = imagenID;
    this.datosImagenes.controls['title'].setValue(imagenTITLE);
    this.datosImagenes.controls['desc'].setValue(imagenDESC);
    this.imgAccess = access;

    for(var i in imagenKEYWORDS) this.keywords.push(imagenKEYWORDS[i].keyword);

    access == "public" ? this.imgPrivacy = true : this.imgPrivacy = false;
    this.imgPrivacy == true ? this.accessToggle = "pública" : this.accessToggle = "privada";
  }

  enviarEdicion(){
    const formularioDatos = new FormData();
    formularioDatos.append('title', this.datosImagenes.controls['title'].getRawValue())
    formularioDatos.append('desc', this.datosImagenes.controls['desc'].getRawValue())
    formularioDatos.append('keywords', JSON.stringify(this.keywords))
    formularioDatos.append('image', this.archivoCapturado)
    formularioDatos.append('access', this.imgAccess)
    
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

  capturarFile(event: any): any{
    this.archivoCapturado = event.target.files[0]
  }

  getPerfilUsuario(){
    this.perfilUsuario == 'E' ? this.esEstudiante = true : this.esEstudiante = false;
    return this.esEstudiante;
  }

  
}
