import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path: 'pregunta', component:PreguntaComponent},
  {path: 'userlist', component:UserListComponent},
  {path: '**', redirectTo:'/home', pathMatch: 'full'},
  {path: '', redirectTo:'/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
