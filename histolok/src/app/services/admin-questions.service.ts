import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminQuestionsService {

  constructor(private http: HttpClient) { }

  postAgregarPregunta(preguntaDatos: any){
    var _url = 'http://127.0.0.1:8000/api/preguntas';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, preguntaDatos, {headers: header, observe:'response'})
  }

  getMisPreguntas(){
    var _url = 'http://localhost:8000/api/preguntas/me';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Content-Type', 'application/json').set('Authorization','Bearer '+bearerToken)
    return this.http.get(_url, {headers: header, observe:'response'})
  }

  putEditarPregunta(preguntaDatos: any, preguntaID: any){
    var _url = 'http://127.0.0.1:8000/api/preguntas/'+preguntaID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.put(_url, preguntaDatos, {headers: header, observe:'response'})
  }

  delEliminarPregunta(preguntaID: any){
    var _url = 'http://127.0.0.1:8000/api/preguntas/'+preguntaID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Accept','application/json').set('Authorization','Bearer '+bearerToken);
    return this.http.delete(_url, {headers: header, observe:'response'})
  }
}
