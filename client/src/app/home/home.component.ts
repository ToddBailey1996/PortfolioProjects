import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChessHostComponent } from "../../lib/chess/chess-host/chess-host.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, ChessHostComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  http = inject(HttpClient);
  registerMode = false;
  users: any;
  projects: any[] = [];
  ngOnInit(): void {
    //this.getUsers();
    this.getProjects(); 
  }
  registertoggle(){
    this.registerMode = !this.registerMode;
  }

  getUsers(){
    this.http.get(environment.apiBaseUrl + '/api/users').subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('GetCompleted')
  })
  }
  cancelRegisterMode(event:boolean){
    this.registerMode = event;
  }

  getProjects(){
    this.http.get<any[]>(environment.apiBaseUrl + '/api/projects').subscribe({
      next: response => this.projects = response,
      error: error => console.log(error),
      complete: () => console.log('GetProjectsCompleted')
  })
  }
}
