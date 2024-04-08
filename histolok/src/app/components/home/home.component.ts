import { Component, OnInit } from '@angular/core';
import { AdminMedalleroService } from 'src/app/services/admin-medallero.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  medallero: any;
  posicion: any = 1;

  constructor(private adminMedalleroService: AdminMedalleroService) { }

  ngOnInit(): void {
    this.adminMedalleroService.getMedalleroGeneral().subscribe((resp: any) => {
      this.medallero = resp.body
      for (let i = 0; i < resp.body.length; i++) {
        this.medallero[i]['numeracion'] = i+1;
      }
      console.log(this.medallero)
    }, error => {
      console.log(error);
    });
  }

}
