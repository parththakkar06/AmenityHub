import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NavigationExtras, Route, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule , NgIf ],
  // providers : ,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private userService : UserService , private route :  Router , private toastr : ToastrService, private mytoast : ToastService){}
  user : any = ''
  // toastr = inject()

  sendDetails(val : any){
    // console.log(val)
    this.userService.login(val).subscribe({
      next : (data) => {
        // console.log(data)
        this.user = {}
        this.route.navigate(['/verifyotp'],{state : data})
        
      },
      error : (err) => {
        this.toastr.error(this.mytoast.getToast(err.error.message, 'error'))
      }
    })
  }
}
