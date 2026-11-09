import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-server-error',
    imports: [],
    templateUrl: './server-error.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './server-error.component.css'
})
export class ServerErrorComponent {
  error:any;
  constructor(private router: Router){
    const Navigation = this.router.getCurrentNavigation();
    this.error - Navigation?.extras?.state?.['error']
  }
}
