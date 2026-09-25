import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-revenue-by-amenity',
  imports: [CommonModule],
  templateUrl: './revenue-by-amenity.component.html',
  styleUrl: './revenue-by-amenity.component.css'
})
export class RevenueByAmenityComponent implements OnInit {
  revenue: any[] = [];
  overallRevenue = 0;
  isLoaded = false;

  constructor(
    private location: Location, 
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.bookingService.getRevenueByAmenity().subscribe({
      next: (r: any) => {
        console.log("Raw revenue response:", r);
        const list = Array.isArray(r) ? r : (r?.revenue || r?.data || []);
        this.revenue = Array.isArray(list) ? list : [];
        this.overallRevenue = 0;
        for (let i = 0; i < this.revenue.length; i++) {
          this.overallRevenue += (Number(this.revenue[i]?.totalRevenue) || 0);
        }
        this.isLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching revenue by amenity:", err);
        this.revenue = [];
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  back() {
    this.location.back();
  }
}
