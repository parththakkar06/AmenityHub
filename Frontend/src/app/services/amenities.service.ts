import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmenitiesService {

  constructor(private http : HttpClient , private route : Router) { }

  getAmenities():Observable<any>{
    return this.http.get<any>('http://localhost:3000/amenity/amenities',{withCredentials : true})
  }
}
