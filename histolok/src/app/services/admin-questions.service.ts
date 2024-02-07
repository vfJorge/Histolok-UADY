import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PATH_SERVER } from '../serverconfig';

@Injectable({
  providedIn: 'root'
})
export class AdminQuestionsService {

  constructor(private http: HttpClient) { }
  URL: string = PATH_SERVER;

  postAgregarPregunta(preguntaDatos: any){
    var _url = this.URL + 'preguntas';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, preguntaDatos, {headers: header, observe:'response'});
  }

  getMisPreguntas(){
    var _url =  this.URL + 'preguntas/me';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken)
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  getPreguntasPublicas(){
    var _url =  this.URL + 'preguntas/public';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken)
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  getPregunta(preguntaID: any){
    var _url =  this.URL + 'preguntas/' + preguntaID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }
  putEditarPregunta(preguntaDatos: any, preguntaID: any){
    var _url =  this.URL + 'preguntas/' + preguntaID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.put(_url, preguntaDatos, {headers: header, observe:'response'});
  }

  delEliminarPregunta(preguntaID: any){
    var _url =  this.URL + 'preguntas/' + preguntaID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.delete(_url, {headers: header, observe:'response'});
  }
}
