import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH_SERVER } from '../serverconfig';

@Injectable({
  providedIn: 'root'
})
export class AdminExamenesService {

  constructor(private http: HttpClient) { }
  URL: string = PATH_SERVER;

  postCrearExamen(examenDatos: any){
    var _url = this.URL + 'examenes'
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, examenDatos, {headers: header, observe:'response'});
  }
  postCrearExamenAlumno(examenDatos: any){
    var _url = this.URL + 'examenes/create'
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, examenDatos, {headers: header, observe:'response'});
  }
  getMisExamenes(){
    var _url =  this.URL + 'examenes/me';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }
  getExamenesPublicos(){
    var _url = this.URL + 'examenes/public';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }
  eliminarExamen(examenID: any){
    var _url =  this.URL + 'examenes/' + examenID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.delete(_url, {headers: header, observe:'response'});
  }
  verExamen(examenID: any){
    var _url = this.URL + 'examenes/' + examenID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  editarExamen(examenDatos: any, examenID: any){
    var _url = this.URL + 'examenes/' + examenID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.put(_url, examenDatos, {headers: header, observe:'response'});
  }

  //PRESENTAR EXAMENES

  empezarExamen(examenID: any){
    var _url =  this.URL + 'examenes/' + examenID +'/start';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  preguntaActualExamen(examenID: any){
    var _url =  this.URL + 'examenes/' + examenID +'/current';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  sigPreguntaExamen(examenID: any, examenDatos: any){
    var _url =  this.URL + 'examenes/' + examenID +'/next';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, examenDatos, {headers: header, observe:'response'});
  }
  
  resultadosExamen(examenID: any){
    var _url =  this.URL + 'examenes/' + examenID +'/results';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }
}
