import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  baseUrl = environment.apiBaseUrl + '/api/';
  private http = inject(HttpClient);
  validationErrors: string[] = [];

  get400Error(){
    this.http.get(this.baseUrl + 'Buggy/bad-request').subscribe({
      next: Response => console.log(Response),
      error: error => console.log(error)
    })
  }
  get401Error(){
    this.http.get(this.baseUrl + 'Buggy/auth').subscribe({
      next: Response => console.log(Response),
      error: error => console.log(error)
    })
  }
  get404Error(){
    this.http.get(this.baseUrl + 'Buggy/not-found').subscribe({
      next: Response => console.log(Response),
      error: error => console.log(error)
    })
  }
  get500Error(){
    this.http.get(this.baseUrl + 'Buggy/server-error').subscribe({
      next: Response => console.log(Response),
      error: error => console.log(error)
    })
  }
  get400ValidationError(){
    this.http.post(this.baseUrl + 'Account/register',{}).subscribe({
      next: Response => console.log(Response),
      error: error => {
        console.log(error);
        this.validationErrors = error;
      }
    })
  }

}
