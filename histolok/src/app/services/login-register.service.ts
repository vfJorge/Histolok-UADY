import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  constructor(private http: HttpClient) { }

  postCrearCuenta(cuenta: any){
    var _url = 'http://localhost:8000/api/auth/register';
    let header= new HttpHeaders({'Content-Type': 'application/json', observe: 'response'})
    return this.http.post(_url, cuenta, {
      headers: header
    })
  }

  postIniciarSesion(cuenta: any){
    var _url = 'http://localhost:8000/api/auth/login';
    let header= new HttpHeaders({'Content-Type': 'application/json', observe: 'response'})
    return this.http.post(_url, cuenta, {
      headers: header
    })
  }

  guardarToken(bearerToken: any){
    localStorage.setItem('bearerToken', bearerToken);
  }
}
