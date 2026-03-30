import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NavigationExtras, Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule , NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private userService : UserService , private route :  Router){}
  user : any = ''


  sendDetails(val : any){
    // console.log(val)
    this.userService.login(val).subscribe({
      next : (data) => {
        // console.log(data)
        this.user = {}
        this.route.navigate(['/verifyotp'],{state : data})
        
      },
      error : (err) => {
        alert(err.error.message)
      }
    })
  }
}
