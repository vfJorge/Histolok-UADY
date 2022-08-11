import { Component } from '@angular/core';
import { LoginRegisterService } from './services/login-register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'histolok';

  isLogged = localStorage.getItem('bearerToken');

  constructor(private loginRegisterService: LoginRegisterService){
  }

  ngOnInit(){
    if(this.isLogged == ''){
      document.getElementById("loginButton").setAttribute("style","display: block");
      document.getElementById("logoutButton").setAttribute("style","display: none");
    }
    else{
      document.getElementById("loginButton").setAttribute("style","display: none");
      document.getElementById("logoutButton").setAttribute("style","display: block");
    }

    this.loginRegisterService.getPerfilUsuario().subscribe((resp: any) => {
      if(resp.status == 201){
        document.getElementById("loginButton").setAttribute("style","display: none");
        document.getElementById("logoutButton").setAttribute("style","display: block");
      }
    }, error => {
      document.getElementById("loginButton").setAttribute("style","display: block");
      document.getElementById("logoutButton").setAttribute("style","display: none");
      console.log(error);
    })
  }

  
}
