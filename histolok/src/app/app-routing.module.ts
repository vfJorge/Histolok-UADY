import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ImagesComponent } from './components/images/images.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ExamenComponent } from './components/examen/examen.component';

const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path: 'pregunta', component:PreguntaComponent},
  {path: 'userList', component:UserListComponent},
  {path: 'userProfile', component:UserProfileComponent},
  {path: 'images', component:ImagesComponent},
  {path: 'questions', component:QuestionsComponent},
  {path: 'examenes', component:ExamenComponent},
  {path: '**', redirectTo:'/home', pathMatch: 'full'},
  {path: '', redirectTo:'/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
