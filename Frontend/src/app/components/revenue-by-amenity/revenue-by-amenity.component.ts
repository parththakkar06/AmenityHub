import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-revenue-by-amenity',
  imports: [CommonModule],
  templateUrl: './revenue-by-amenity.component.html',
  styleUrl: './revenue-by-amenity.component.css'
})
export class RevenueByAmenityComponent {
  revenue: any[] = []
  overallRevenue = 0

  constructor(private location: Location, private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingService.getRevenueByAmenity().subscribe({
      next: (r: any) => {
        this.revenue = Array.isArray(r) ? r : (r?.revenue || r?.data || [])
        this.overallRevenue = 0
        for (let i = 0; i < this.revenue.length; i++) {
          this.overallRevenue += (this.revenue[i]?.totalRevenue || 0)
        }
      },
      error: (err) => {
        console.error("Error fetching revenue by amenity:", err)
      }
    })
  }

  back() {
    this.location.back()
  }
}
