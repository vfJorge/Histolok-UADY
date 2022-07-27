import { Component, OnInit } from '@angular/core';
import { UserListService } from 'src/app/services/user-list.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public listaUsuarios: Array<any> = [];

  constructor(private userlistService: UserListService) {
    this.userlistService.getPerfilesUsuarios().subscribe((resp: any) => {
      this.listaUsuarios = resp.body;
    })
  }

  ngOnInit(): void {
  }

}
