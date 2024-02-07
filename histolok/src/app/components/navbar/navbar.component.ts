import { Component, OnInit } from '@angular/core';
import { LoginRegisterService } from 'src/app/services/login-register.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  tipoUsuario: any = '';

  constructor(private loginRegisterService: LoginRegisterService) { }

  ngOnInit(): void {
    this.loginRegisterService.getPerfilUsuario().subscribe((resp: any) => {
      this.tipoUsuario = resp.body.type
    }, error => {
      console.log(error);
    })
  }


  cerrarSesion(){
    this.loginRegisterService.postCerrarSesion().subscribe((response: any) => {
    }, error => {
      console.log(error);
    })
    localStorage.setItem('bearerToken','');
    window.location.reload();
  }
}
