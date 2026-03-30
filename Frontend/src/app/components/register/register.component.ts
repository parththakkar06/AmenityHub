import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private userService : UserService , private route : Router) {}

  phoneregex = /^[6-9]\d{9}$/;

  registerForm = new FormGroup({
    name : new FormControl('Sam',[Validators.required]),
    email : new FormControl('sam@yopmail.com',[Validators.required, Validators.email]),
    password : new FormControl('111111',[Validators.required , Validators.minLength(6)]),
    phone : new FormControl('9879879871',[Validators.required, Validators.pattern(this.phoneregex)]),
    block : new FormControl('A',Validators.required),
    flat : new FormControl('101',Validators.required),
    role : new FormControl('USER')
  })
  

  onSubmit(){
    console.log(this.registerForm.value)
    this.userService.register(this.registerForm.value).subscribe(()=>{
      this.route.navigate(['/login'])
    })
  }

  get name(){
    return this.registerForm.get('name')
  }

  get email(){
    return this.registerForm.get('email')
  }

  get password(){
    return this.registerForm.get('password')
  }

  get phone(){
    return this.registerForm.get('phone')
  }

  get block(){
    return this.registerForm.get('block')
  }

  get flat(){
    return this.registerForm.get('flat')
  }
  

}
