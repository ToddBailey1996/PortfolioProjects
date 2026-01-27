import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {User} from '../_models/user';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private http = inject(HttpClient);
  //baseUrl = 'https://localhost:5001/api/';
  baseUrl = 'https://toddportfolio-e6dmbnaag3gcc6fz.westeurope-01.azurewebsites.net/api/'; 
  currentUser = signal<User | null>(null);
  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user =>{
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
      })

    )
  }
  logout(){
    
    localStorage.removeItem('user');
    this.currentUser.set(null);

  }
  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user =>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })

    )
  }
}
