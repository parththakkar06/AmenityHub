import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http : HttpClient , private route : Router) { }

  getBookingById(id : string){
    return this.http.get("http://localhost:3000/booking/bookings"+"/"+id,{withCredentials : true})
  }

}
