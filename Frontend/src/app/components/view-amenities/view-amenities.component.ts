import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-amenities',
  imports: [RouterLink],
  templateUrl: './view-amenities.component.html',
  styleUrl: './view-amenities.component.css'
})
export class ViewAmenitiesComponent {
  amenities : any

  constructor(private location : Location,private amenityService : AmenitiesService , private route : Router){}

  ngOnInit(){
    this.amenityService.getAmenities().subscribe({
      next : (a) => {
        this.amenities = a
        this.amenities = this.amenities.data
        console.log(this.amenities)
      }
    })
  }


  deleteAmenity(id : string){
    this.amenityService.deleteAmenity(id).subscribe(()=>{
      this.getAmenities()
    })
  }

  getAmenities(){
    this.amenityService.getAmenities().subscribe({
      next : (a) => {
        this.amenities = a
        this.amenities = this.amenities.data
        console.log(this.amenities)
      }
    })
  }

  back(){
    this.location.back()
  }

  editAmenity(amenity : object,id : string){
    // this.amenityService.editAmenity(amenity,id).subscribe({
    //   next : () => {

    //   },
    //   error : (e) => {
    //     console.error(e)
    //   }
    // })    
    console.log(amenity,id)
    this.route.navigate(['/dashboard/add-amenity'],{state : {amenity,id}})
  }
}
