import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router } from '@angular/router';
import { SaveuserService } from '../../services/saveuser.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  amenityList : any = ''
  constructor(private amenityService : AmenitiesService , private route : Router,private saveUser : SaveuserService){}

  ngOnInit(){
    const user = this.saveUser.getUser()
    if(user.bool == true){
      this.route.navigate(['/change-password'])
    }
    this.amenityService.getAmenities().subscribe((data)=>{
      this.amenityList = data.data
    })
  }

  showData(){
    console.log(this.amenityList[0])
  }

  bookNow(name : string, pricePerHour : number){
    this.route.navigate(['/book-amenity'],{state : {name,pricePerHour}})
  }
}
