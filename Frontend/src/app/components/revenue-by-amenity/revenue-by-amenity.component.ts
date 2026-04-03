import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revenue-by-amenity',
  imports: [CommonModule],
  templateUrl: './revenue-by-amenity.component.html',
  styleUrl: './revenue-by-amenity.component.css'
})
export class RevenueByAmenityComponent {

  constructor(private bookingService : BookingService){}

  revenue : any
  overallRevenue = 0
  ngOnInit(){
    this.bookingService.getRevenueByAmenity().subscribe({
      next: (r) => {
        this.revenue = r
        this.revenue = this.revenue.revenue
        for (let i = 0; i < this.revenue.length; i++) {
          this.overallRevenue += this.revenue[i].totalRevenue;
        }
      }
    })
  }
}
