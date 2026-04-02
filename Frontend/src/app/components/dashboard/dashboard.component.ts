import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { BookingService } from '../../services/booking.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive, HeaderComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private route : Router,private ammenityService : AmenitiesService, private bookingService : BookingService){}

  amenityCount : any
  bookingCount : any
  revenue : any

  ngOnInit(){
    this.ammenityService.getAmenityCount().subscribe({
      next : (data) => {
        this.amenityCount = data
        this.amenityCount = this.amenityCount.count
      }
    })

    this.bookingService.getBookingsCount().subscribe({
      next : (count) => {
        this.bookingCount = count
        this.bookingCount = this.bookingCount.count
      }
    })

    this.bookingService.getRevenue().subscribe({
      next : (r) => {
        console.log(r)
        this.revenue = r
        this.revenue = this.revenue.Revenue
      }
    })
  }


  // viewAmenities(){
  //   this.route.navigate(['/dashboard/view-amenities'])
  // }



}
