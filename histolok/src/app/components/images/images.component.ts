import { Component, OnInit } from '@angular/core';
import { AdminImagesService } from 'src/app/services/admin-images.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  public misImagenes: Array<any> = [];
  imagenesURL = "http://127.0.0.1:8000/storage/";

  constructor(private adminImagesService: AdminImagesService) { }

  ngOnInit(): void {
    this.adminImagesService.getMisImagenes().subscribe((resp: any) => {
      console.log(resp.body);
      this.misImagenes = resp.body;
    }, error => {
      console.log(error);
    })
  }

  
}
