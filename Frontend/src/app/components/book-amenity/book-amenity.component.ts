import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router } from '@angular/router';
import { SaveuserService } from '../../services/saveuser.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-book-amenity',
  imports: [ReactiveFormsModule , NgIf],
  templateUrl: './book-amenity.component.html',
  styleUrl: './book-amenity.component.css'
})
export class BookAmenityComponent {

  amenityName : any = ''
  user = ''
  constructor(private amenityService : AmenitiesService , private route : Router , private saveUser : SaveuserService){
    const nav = route.getCurrentNavigation()
    const data = nav?.extras?.state
    this.user = saveUser.getUser()
    this.amenityName = data
    //data.name ---> ameniity name
    //user.id ---> user id
  }

  bookingForm = new FormGroup({
    date : new FormControl('',[Validators.required]),
    startTime : new FormControl('',[Validators.required]),
    endTime : new FormControl('',[Validators.required])
  })

  get date(){
    return this.bookingForm.get('date')
  }

  get startTime(){
    return this.bookingForm.get('startTime')
  }

  get endTime(){
    return this.bookingForm.get('endTime')
  }

  onSubmit(){
    console.log(this.bookingForm.value)
  }


}
