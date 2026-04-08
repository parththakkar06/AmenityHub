import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { BookingService } from '../../services/booking.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private route: Router, private ammenityService: AmenitiesService, private bookingService: BookingService) { }

  amenityCount: any
  bookingCount: any
  revenue: any
  pendingBookings: any

  ngOnInit() {
    this.ammenityService.getAmenityCount().subscribe({
      next: (data) => {
        this.amenityCount = data
        this.amenityCount = this.amenityCount.count
      }
    })

    this.bookingService.getBookingsCount().subscribe({
      next: (count) => {
        this.bookingCount = count
        this.bookingCount = this.bookingCount.count
      }
    })

    this.bookingService.getRevenue().subscribe({
      next: (r) => {
        console.log(r)
        this.revenue = r
        this.revenue = this.revenue.Revenue
        this.revenue = Math.round(this.revenue * 100) / 100
      }
    })

    this.bookingService.getPendingBookings().subscribe({
      next: (count) => {
        this.pendingBookings = count
        this.pendingBookings = this.pendingBookings.data
        console.log(count)
        if (this.pendingBookings) {
          this.openConfirm(
            'Notification Alert!',
            `You have ${this.pendingBookings} pending booking requests!`,
            () => {

            }
          );
        }

      }
    })
  }


  // viewAmenities(){
  //   this.route.navigate(['/dashboard/view-amenities'])
  // }
  showConfirm = false;
  title = '';
  subject = ''
  private confirmCallback: () => void = () => { };

  openConfirm(title: string, subject: string, callback: () => void) {
    this.title = title;
    this.subject = subject;
    this.confirmCallback = callback;
    this.showConfirm = true;
  }

  onConfirm() {
    this.confirmCallback();
    this.showConfirm = false;
  }

  // onCancel() {
  //   this.showConfirm = false;
  //   this.route.navigate(['/login'])
  // }



}
