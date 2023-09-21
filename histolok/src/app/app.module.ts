import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ImagesComponent } from './components/images/images.component';
import { AgregarImgComponent } from './components/agregar-img/agregar-img.component';
import { ModalImagenComponent } from './components/images/modal-imagen/modal-imagen.component';
import { MaterialModule } from './material/material.module';
import { QuestionsComponent } from './components/questions/questions.component';
import { AgregarQuestionComponent } from './components/agregar-question/agregar-question.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ModalQuestionsComponent } from './components/questions/modal-questions/modal-questions.component';
import { AgregarExamenComponent } from './components/agregar-examen/agregar-examen.component';
import { ExamenComponent } from './components/examen/examen.component';
import { ModalExamenComponent } from './components/examen/modal-examen/modal-examen.component';
import { ListaExamenesComponent } from './components/lista-examenes/lista-examenes.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { ModalImagenPreguntaComponent } from './components/pregunta/modal-imagen-pregunta/modal-imagen-pregunta.component';
import { ModalResultadoComponent } from './components/resultados/modal-resultado/modal-resultado.component';
import { ListaGruposComponent } from './components/lista-grupos/lista-grupos.component';
import { AgregarGrupoComponent } from './components/agregar-grupo/agregar-grupo.component';
import { GrupoComponent } from './components/grupo/grupo.component';
import { ModalResultadosAlumnoComponent } from './components/grupo/modal-resultados-alumno/modal-resultados-alumno.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    PreguntaComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    ImagesComponent,
    AgregarImgComponent,
    ModalImagenComponent,
    QuestionsComponent,
    AgregarQuestionComponent,
    UserProfileComponent,
    ModalQuestionsComponent,
    AgregarExamenComponent,
    ExamenComponent,
    ModalExamenComponent,
    ListaExamenesComponent,
    ResultadosComponent,
    ModalImagenPreguntaComponent,
    ModalResultadoComponent,
    ListaGruposComponent,
    AgregarGrupoComponent,
    GrupoComponent,
    ModalResultadosAlumnoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
