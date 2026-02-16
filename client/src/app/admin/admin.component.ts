import { Component, inject } from '@angular/core';
import { UsersCrudDto } from '../_models/UsersCrudDto';
import { AdminService } from '../_services/Admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private adminService = inject(AdminService);
  Users: UsersCrudDto[] = [];
  selectedUser?: UsersCrudDto;
  isEditMode: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
   isModalOpen = false;
  constructor() { 

    this.getusers();

  }
  
  

  createUser(){
    this.selectedUser = {
       id: 0,
      username: '',
      isActive: true,
      createdDate: new Date(),
      password: ''
      };
      this.isEditMode = false;
      this.isModalOpen = true;

    
  }
  deleteUser(id: number){
    this.adminService.deleteUser(id).subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    }); 
  }
  getusers(){
    this.adminService.getUsers().subscribe({
      next: response => this.Users = response,
      error: error => console.log(error)
    });
  }
  editUser(user: UsersCrudDto) {
     console.log('Edit button clicked', user);
      this.isEditMode = true;
    this.isModalOpen = true;
      this.selectedUser = { ...user }; // Create a copy of the user to edit
  }

  closeModal() {
    this.isModalOpen = false;
  }
  confirmAction() {
    if (this.isEditMode) {

      if (this.selectedUser) {
        // Find the index of the user in the Users array
        const index = this.Users.findIndex(u => u.id === this.selectedUser!.id);
        if (index !== -1) {
          // Update the user in the array
          this.Users[index] = { ...this.selectedUser };
          this.adminService.updateUser(this.selectedUser).subscribe({
            next: response => console.log(response),
            error: error => console.log(error)
          });
        }
      } 
  } else {

      if (this.selectedUser) {
        this.selectedUser.password = this.newPassword; // Set the password for the new user
        this.selectedUser.isActive = true; // Set the new user as active
        this.selectedUser.createdDate = new Date(); // Set the created date for the new user
        this.adminService.createUser(this.selectedUser).subscribe({
          next: response => {
            this.Users.push(response);
            this.closeModal();
          },
          error: error => console.log(error)
        });
      }
  }
}
  changePassword(user: UsersCrudDto) {

    if (this.newPassword !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.adminService.changePassword(user.id, this.newPassword).subscribe({
      next: response => {
        alert("Password updated successfully!");
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: error => console.log(error)
    });
  }
}
