import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChessHostComponent } from "../../lib/chess/chess-host/chess-host.component";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { throwError, TimeoutError } from 'rxjs';
import { timeout, catchError, finalize,retry } from 'rxjs/operators';
import { delay } from 'rxjs/operators'; // Import the operator
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, ChessHostComponent, CommonModule,MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  http = inject(HttpClient);
  registerMode = false;
  users: any;
  visibleProjects: {  component: any; title: string; techList: string , description: string }[] = [];
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
    //this.http.get<any[]>(environment.apiBaseUrl + '/api/projects')
     this.http.get<any[]>(environment.apiBaseUrl + '/api/projects').pipe(
    // Set a 5-second timeout limit
    timeout(5000),
    retry({
      count: 10, // Number of retry attempts before giving up
      delay: (error) => {
        // ONLY retry if the error is a TimeoutError
        if (error instanceof TimeoutError) {
          console.warn('Request timed out. Retrying...');
          return [error]; // Returning an array/observable triggers the retry
        }
        // If it's a 404, 500, etc., don't retry, just pass the error along
        throw error; 
      }
    }),
    catchError((error) => {
      if (error instanceof TimeoutError) {
        console.error('The server took too long to respond.');
        // You can assign a fallback array or just throw the error
      } else {
        console.error('An unexpected error occurred:', error);
      }
      return throwError(() => error);
    }),
    
    // Finalize guarantees this runs when the observable completes or errors out
   finalize(() => {
      this.isLoading = false;
    })
     ).subscribe({
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
