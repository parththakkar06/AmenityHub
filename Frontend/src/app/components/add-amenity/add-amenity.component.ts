import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-amenity',
  imports: [ReactiveFormsModule],
  templateUrl: './add-amenity.component.html',
  styleUrl: './add-amenity.component.css'
})
export class AddAmenityComponent {
  amenityForm = new FormGroup({
    name : new FormControl(''),
    pricePerHour : new FormControl(''),
    capacity : new FormControl(''),
    location : new FormControl(''),
    description : new FormControl(''),
    openingTime : new FormControl(''),
    closingTime : new FormControl(''),
    rules : new FormControl('')
  })

  get name(){
    return this.amenityForm.get('name')
  }
  get pricePerHour(){
    return this.amenityForm.get('pricePerHour')
  }
  get capacity(){
    return this.amenityForm.get('capacity')
  }
  get location(){
    return this.amenityForm.get('location')
  }
  get description(){
    return this.amenityForm.get('description')
  }
  get openingTime(){
    return this.amenityForm.get('openingTime')
  }
  get closingTime(){
    return this.amenityForm.get('closingTime')
  }
  get rules(){
    return this.amenityForm.get('rules')
  }

  submit(data : any){
    
  }
}
