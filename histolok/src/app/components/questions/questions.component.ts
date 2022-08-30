import { Component, OnInit } from '@angular/core';
import { LoginRegisterService } from '../../services/login-register.service';
import { AdminQuestionsService } from 'src/app/services/admin-questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  public misPreguntas: Array<any> = [];
  perfilUsuario: string = "";
  esEstudiante: boolean;

  constructor(private adminQuestionsService: AdminQuestionsService,
    private loginRegisterService : LoginRegisterService,) { }

  ngOnInit(): void {
    this.adminQuestionsService.getMisPreguntas().subscribe((resp: any) => {
      this.misPreguntas = resp.body;
      console.log(resp.body);
    }, error => {
      console.log(error);
    })
  }

  eliminarPregunta(preguntaID: any){
    this.adminQuestionsService.delEliminarPregunta(preguntaID).subscribe((resp: any) => {
      if(resp.status == 200){
        alert("Imagen eliminada de manera exitosa");
        window.location.reload();
      }
    }, error => {
      console.log(error);
      alert("No se pudo eliminar la imagen, inténtalo de nuevo");
    })
  }

  getPerfilUsuario(){
    this.perfilUsuario == 'E' ? this.esEstudiante = true : this.esEstudiante = false;
    return this.esEstudiante;
  }
}
