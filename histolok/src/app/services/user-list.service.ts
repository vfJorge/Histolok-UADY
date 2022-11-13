import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(private http: HttpClient) { }
  URL: string = 'http://127.0.0.1:8000/api/';

  getPerfilesUsuarios(){
    var _url = this.URL + 'users';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken)
    return this.http.get(_url, {headers: header, observe:'response'});
  }
}