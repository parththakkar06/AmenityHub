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

  bookAmenity(id : string, credentials : object):Observable<any>{
    return this.http.post<any>("http://localhost:3000/booking/bookings"+"/"+id,credentials,{withCredentials : true})
  }

  getPastBookingById(id : string){
    return this.http.get("http://localhost:3000/booking/pastbookings"+"/"+id,{withCredentials : true})
  }

  getBookingsCount(){
    return this.http.get('http://localhost:3000/booking/getbookingscount',{withCredentials:true})
  }

  getRevenue(){
    return this.http.get('http://localhost:3000/booking/getrevenue',{withCredentials : true})
  }

  getAllBookings(){
    return this.http.get('http://localhost:3000/booking/bookings',{withCredentials : true})
  }

  getApprovedBookings(){
    return this.http.get('http://localhost:3000/booking/approvedcount',{withCredentials : true})
  }
  
  getRejectedBookings(){
    return this.http.get('http://localhost:3000/booking/rejectedcount',{withCredentials : true})
  }

  getRevenueByAmenity(){
    return this.http.get('http://localhost:3000/booking/revenuebyamenity',{withCredentials : true})
  }

  sendStatus(id : string,credentials : object){
    return this.http.put('http://localhost:3000/booking/status'+'/'+id,credentials,{withCredentials : true})
  }
}
