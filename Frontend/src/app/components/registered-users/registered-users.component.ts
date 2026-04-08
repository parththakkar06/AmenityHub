import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registered-users',
  imports: [],
  templateUrl: './registered-users.component.html',
  styleUrl: './registered-users.component.css'
})
export class RegisteredUsersComponent {
  users : any

  constructor(private location : Location,private userService : UserService){}

  ngOnInit(){
    this.userService.getusers().subscribe({
      next : (u) => {
        console.log(u)

        this.users = u
        this.users = this.users.data
      }
    })
  }

  back(){
    this.location.back()
  }
}
