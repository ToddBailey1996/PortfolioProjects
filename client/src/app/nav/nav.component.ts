import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../_services/accounts.service';
import { TitleCasePipe } from '@angular/common';
//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from '@openng/ngx-toastr';
@Component({
    selector: 'app-nav',
    imports: [FormsModule, RouterLink, RouterLinkActive, TitleCasePipe],
    templateUrl: './nav.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};
  profileMenuOpen = false;
  login(){
    this.accountService.login(this.model).subscribe({
      next: (user) => {
        
        this.router.navigateByUrl('/home')

      },
      error: error => this.toastr.error(error.error)
    
    });
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }
  

toggleProfileMenu() {
  this.profileMenuOpen = !this.profileMenuOpen;
}

closeProfileMenu() {
  this.profileMenuOpen = false;
}
}
 