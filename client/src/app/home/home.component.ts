import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChessHostComponent } from "../../lib/chess/chess-host/chess-host.component";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs/operators'; // Import the operator
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, ChessHostComponent, CommonModule,MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  http = inject(HttpClient);
  registerMode = false;
  users: any;
  visibleProjects: {  component: any; techList: string , description: string }[] = [];
  ProjectMap: Record<string, any> = {
    'ChessGame':ChessHostComponent

  };
  selectedProject?: any;
  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  isLoading: boolean = true;
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
    this.isLoading = true;
    this.http.get<any[]>(environment.apiBaseUrl + '/api/projects').pipe(delay(20000)).subscribe({
      next: projects  =>{ 
        this.visibleProjects = projects.map(p => ({
          component: this.ProjectMap[p.name],
          title: p.title,
          techList: p.techList,
          description: p.description

      }));
  },
      error: error => {
        console.log(error);
        this.isLoading = false;
      },
      complete: () => {
        console.log(this.visibleProjects);
        this.isLoading = false;
      }
  });
  }

   closeModal() {
    this.isModalOpen = false;
  }
  OpenModal(project: any){
     console.log('About button clicked', project.description);
    this.selectedProject = project;
    this.isModalOpen = true;
  }
}
