import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';

@Component({
  selector: 'app-view-amenities',
  imports: [],
  templateUrl: './view-amenities.component.html',
  styleUrl: './view-amenities.component.css'
})
export class ViewAmenitiesComponent {
  amenities : any

  constructor(private amenityService : AmenitiesService){}

  ngOnInit(){
    this.amenityService.getAmenities().subscribe({
      next : (a) => {
        this.amenities = a
        this.amenities = this.amenities.data
        console.log(this.amenities)
      }
    })
  }
}
