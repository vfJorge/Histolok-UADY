import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'histolok';

  isLogged = localStorage.getItem('bearerToken');

  constructor(){
  }

  ngOnInit(){
    if(this.isLogged != ''){
      document.getElementById("loginButton").setAttribute("style","display: none");
      document.getElementById("logoutButton").setAttribute("style","display: block");
    }
    else{
      document.getElementById("loginButton").setAttribute("style","display: block");
      document.getElementById("logoutButton").setAttribute("style","display: none");
    }
  }

  
}
