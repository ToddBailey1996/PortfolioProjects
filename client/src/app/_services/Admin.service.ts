import { HttpClient } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import {User} from '../_models/user';
import {UsersCrudDto} from '../_models/UsersCrudDto';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectCrudDto } from '../_models/ProjectCrudDto';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);
  //baseUrl = 'https://localhost:5001/api/';
  //baseUrl = 'https://toddportfolio-e6dmbnaag3gcc6fz.westeurope-01.azurewebsites.net/api/'; 
  baseUrl = environment.apiBaseUrl + '/api/';
  
    getUsers(){
        return this.http.get<UsersCrudDto[]>(this.baseUrl + 'users');

    }
    createUser(model: UsersCrudDto){
        return this.http.post<UsersCrudDto>(this.baseUrl + 'account/register', model)

    }
    deleteUser(id: number){
        return this.http.delete(this.baseUrl + 'users/' + id);
    }
    updateUser(model: UsersCrudDto){
        return this.http.put(this.baseUrl + 'users/' + model.id, model);
    
    }
    changePassword(id: number, newPassword: string){
        return this.http.post(this.baseUrl + `users/${id}/change-password`, { newPassword });
    }
    getUserByUsername(username: string){
        return this.http.get<UsersCrudDto>(this.baseUrl + `users/username/${username}`);
    }

    getprojects(){
    return this.http.get<ProjectCrudDto[]>(this.baseUrl + 'projects');
    }
    createProject(model: ProjectCrudDto){
    return this.http.post<ProjectCrudDto>(this.baseUrl + 'projects', model);
    }
    updateProject(model: ProjectCrudDto){ 
    return this.http.put(this.baseUrl + 'projects/' + model.id, model); 
    }
    deleteProject(id: number){
    return this.http.delete(this.baseUrl + 'projects/' + id);
    }   
}
