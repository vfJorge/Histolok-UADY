import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH_SERVER } from '../serverconfig';

@Injectable({
  providedIn: 'root'
})
export class AdminMedalleroService {

  
  constructor(private http: HttpClient) { }
  URL: string = PATH_SERVER;

  getMedalleroGeneral(){
    var _url = this.URL + 'examenes/medallero'
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }

  getMedalleroExamenID(examenID: any){
    var _url = this.URL + 'examenes/medallero/'+examenID
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken);
    return this.http.get(_url, {headers: header, observe:'response'});
  }
}
