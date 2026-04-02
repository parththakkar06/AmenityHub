import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-booking',
  imports: [CommonModule],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css'
})
export class AdminBookingComponent {
  bookings : any
  activeTab = 'all'
  constructor(private bookingService : BookingService){}

  ngOnInit(){
    this.bookingService.getAllBookings().subscribe({
      next : (book) => {
        this.bookings = book
        console.log(book)
        this.bookings = this.bookings.data
      }
    })
  }
}
