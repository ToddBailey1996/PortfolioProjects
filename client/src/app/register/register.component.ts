import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../_services/accounts.service';
import { ToastrService } from '@openng/ngx-toastr';

@Component({
    selector: 'app-register',
    imports: [FormsModule],
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountsService);
  private toastr = inject(ToastrService)
  usersFromHomeComponet = input.required<any>();
  cancelRegister = output<boolean>()
  model: any = {}

  /*register(){
    this.accountService.register(this.model).subscribe({
      next:response =>{
        console.log(response);
        this.cancel();
      },
      error: error => this.toastr.error(error.error)
      
    })
  }*/
  cancel(){
    this.cancelRegister.emit(false);
  }
  

}
