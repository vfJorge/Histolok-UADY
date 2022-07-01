import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminImagesService {

  constructor(private http: HttpClient) { }

  postAgregarImagen(imagenDatos: any){
    var _url = 'http://127.0.0.1:8000/api/fotos';
    let header= new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post(_url, imagenDatos, {headers: header, observe:'response'})
  }
}
