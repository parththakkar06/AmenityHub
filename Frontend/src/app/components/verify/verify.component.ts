import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SaveuserService } from '../../services/saveuser.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {

  public mail: any = ''
  data: any;
  user : any = ''
  constructor(private toast : ToastService,private userService: UserService, private router: Router, private saveUser : SaveuserService) {
    const nav = this.router.getCurrentNavigation()
    const user : any = nav?.extras?.state
    console.log(user)
    this.mail = user['email']
    this.user = user
  }

  // ngOnInit() {
  //   console.log(this.mail)
  // }



  regex = /^[0-9]{6}$/;

  otpForm = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.pattern(this.regex)]),
  })

  
  verifyOtp() {

    this.data = { otp : this.otpForm.value.otp, email: this.mail }
    console.log('this is data',this.data)
    this.userService.verify(this.data).subscribe({
      next: (data : any) => {
        this.toast.show('Login Successfull','success')
        this.saveUser.setUser(data.user)
        console.log(data.user)
        if(this.user.role === "ADMIN"){
          this.router.navigate(['/dashboard'])
        }else{
          this.router.navigate(['/home'])
        }
      },
      error: (err) => {
        this.toast.show(err.error.message,'error')
      }
    })
  }

  resendOtp() {

  }

  get otp() {
    return this.otpForm.get('otp')
  }
}
