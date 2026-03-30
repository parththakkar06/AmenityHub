import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  login(credentials : object){
    return this.http.post('http://localhost:3000/user/login',credentials,{withCredentials : true})
  }

  register(credentials : object){
    return this.http.post('http://localhost:3000/user/register',credentials,{withCredentials : true})
  }

  verify(credentials : object){
    return this.http.post('http://localhost:3000/user/verify-otp',credentials,{withCredentials : true})
  }

  getusers(){
    return this.http.get('http://localhost:3000/user/users',{withCredentials : true})
  }

}
