import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  constructor(private http: HttpClient) { }
  URL: string = 'http://127.0.0.1:8000/api/';

  postCrearCuenta(cuenta: any){
    var _url = this.URL + 'auth/register';
    let header= new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post(_url, cuenta, {headers: header, observe:'response'})
  }

  postIniciarSesion(cuenta: any){
    var _url = this.URL + 'auth/login';
    let header= new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post(_url, cuenta, {headers: header, observe:'response'})
  }

  postCerrarSesion(){
    var _url = this.URL + 'auth/logout';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken)
    return this.http.post(_url, {headers: header, observe:'response'})
  }

  getPerfilUsuario(){
    var _url = this.URL + 'users/me';
    var bearerToken = localStorage.getItem('bearerToken');
    let header= new HttpHeaders().set('Authorization','Bearer '+bearerToken)
    return this.http.get(_url, {headers: header, observe:'response'})
  }

  guardarToken(bearerToken: any){
    localStorage.setItem('bearerToken', bearerToken);
  }
}
