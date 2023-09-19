import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminGruposService {

  constructor(private http: HttpClient) { }
  URL: string = 'http://127.0.0.1:8000/api/';

  getMisGrupos(){
    var _url = this.URL + 'grupos/me'
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }
  
  eliminarGrupo(grupoID: any){
    var _url =  this.URL + 'grupos/' + grupoID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.delete(_url, {headers: header, observe:'response'});
  }

  getGrupo(grupoID: any){
    var _url = this.URL + 'grupos/' + grupoID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  editarGrupo(grupoDatos: any, grupoID: any){
    var _url = this.URL + 'grupos/' + grupoID;
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.put(_url, grupoDatos, {headers: header, observe:'response'});
  }

  postCrearGrupo(grupoDatos: any){
    var _url = this.URL + 'grupos'
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.post(_url, grupoDatos, {headers: header, observe:'response'});
  }
  
}
