import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminImagesService {

  constructor(private http: HttpClient) { }

  postAgregarImagen(imagenDatos: any){
    var _url = 'http://127.0.0.1:8000/api/fotos';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, imagenDatos, {headers: header, observe:'response'})
  }

  VerTodas(){
    var _url = 'http://127.0.0.1:8000/api/fotos';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'})
  }
  getMisImagenes(){
    var _url = 'http://localhost:8000/api/fotos/me';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Content-Type', 'application/json').set('Authorization','Bearer '+bearerToken)
    return this.http.get(_url, {headers: header, observe:'response'})
  }

  delEliminarImagen(imagenID: any){
    var _url = 'http://127.0.0.1:8000/api/fotos/'+imagenID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.delete(_url, {headers: header, observe:'response'})
  }

  putEditarImagen(imagenDatos: any, imagenID: any){
    var _url = 'http://127.0.0.1:8000/api/fotos/'+imagenID+'?_method=PUT';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, imagenDatos, {headers: header, observe:'response'})
  }
}
