import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminExamenesService {

  constructor(private http: HttpClient) { }
  URL: string = 'http://127.0.0.1:8000/api/';

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
 
}
