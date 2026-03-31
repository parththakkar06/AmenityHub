import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveuserService {

  constructor() { }

  private userSubject =  new BehaviorSubject<any>(this.getUserFromStorage())
  user$ = this.userSubject.asObservable()

  setUser(user : any){
    this.userSubject.next(user)
    localStorage.setItem('user',JSON.stringify(user))
  }

  getUser(){
    return this.userSubject.value
  }

  clearUser(){
    this.userSubject.next(null)
    localStorage.removeItem('user')
  }

  getUserFromStorage() : any{
    const data = localStorage.getItem('user')
    return data ? JSON.parse(data) : null
  }
}
