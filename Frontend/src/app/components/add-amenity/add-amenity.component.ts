import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmenitiesService } from '../../services/amenities.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-amenity',
  imports: [ReactiveFormsModule],
  templateUrl: './add-amenity.component.html',
  styleUrl: './add-amenity.component.css'
})
export class AddAmenityComponent {

  constructor(private amenityService: AmenitiesService, private route: Router,private location1: Location) {

    const nav = route.getCurrentNavigation()
    const data: any = nav?.extras?.state
    this.amenityData = data?data['amenity']:null
    this.amenityId = data?data['id']:null
    // console.log(this.amenityData)
  }
  amenityData: any
  amenityId: any
  ngOnInit() {
    if (this.amenityId) {
      const name: string = this.amenityData.name
      const pricePerHour: string = this.amenityData.pricePerHour
      const location: string = this.amenityData.location
      const capacity: string = this.amenityData.capacity
      const description: string = this.amenityData.description
      const closingTime: string = this.amenityData.availibility.closingTime
      const rules: string = this.amenityData.rules
      const openingTime: string = this.amenityData.availibility.openingTime

      this.amenityForm.setValue({
        name: name,
        pricePerHour: pricePerHour,
        capacity: capacity,
        location: location,
        description: description,
        closingTime: closingTime,
        openingTime: openingTime,
        rules: rules
      })
    }
  }

  amenityForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    pricePerHour: new FormControl('',[Validators.required]),
    capacity: new FormControl('',[Validators.required]),
    location: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    openingTime: new FormControl('',[Validators.required]),
    closingTime: new FormControl('',[Validators.required]),
    rules: new FormControl('',[Validators.required])
  })

  get name() {
    return this.amenityForm.get('name')
  }
  get pricePerHour() {
    return this.amenityForm.get('pricePerHour')
  }
  get capacity() {
    return this.amenityForm.get('capacity')
  }
  get location() {
    return this.amenityForm.get('location')
  }
  get description() {
    return this.amenityForm.get('description')
  }
  get openingTime() {
    return this.amenityForm.get('openingTime')
  }
  get closingTime() {
    return this.amenityForm.get('closingTime')
  }
  get rules() {
    return this.amenityForm.get('rules')
  }

  back(){
    this.location1.back()
  }

  submit(data: any) {
    if (this.amenityData) {
      this.amenityService.editAmenity(data,this.amenityId).subscribe({
        next : () => {
          this.route.navigate(['dashboard/view-amenities'])
        }
      })
    } else {
      console.log(data)
      this.amenityService.addAmenity(data).subscribe({
        next: () => {
          // console.log("add amenity called")
          this.route.navigate(['dashboard'])
        },
        error: (e) => {
          console.error(e)
        }
      })
    }
  }
}
