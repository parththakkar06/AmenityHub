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

  getAmenityCount(){
    return this.http.get('http://localhost:3000/amenity/getamenitycount',{withCredentials : true})
  }

  deleteAmenity(id : string){
    return this.http.delete('http://localhost:3000/amenity/amenities'+'/'+id,{withCredentials : true})
  }

  addAmenity(credentials : object){
    return this.http.post('http://localhost:3000/amenity/amenities', credentials , {withCredentials : true})
  }

  editAmenity(credentials : object, id : string){
    return this.http.put('http://localhost:3000/amenity/amenities'+'/'+id , credentials , {withCredentials : true})
  }

  summary(){
    return this.http.get('http://localhost:3000/amenity/amenitysummary',{withCredentials : true})
  }

  trend(){
    return this.http.get('http://localhost:3000/amenity/trends',{withCredentials: true})
  }
}
