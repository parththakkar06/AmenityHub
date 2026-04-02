import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SaveuserService } from '../../services/saveuser.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mybookings',
  imports: [CommonModule],
  templateUrl: './mybookings.component.html',
  styleUrl: './mybookings.component.css'
})
export class MybookingsComponent {

  constructor(private route: Router, private bookingService: BookingService, private saveUser: SaveuserService) { }

  bookings: any
  data: any
  ngOnInit() {
    const user = this.saveUser.getUserFromStorage()
    this.bookingService.getBookingById(user.id).subscribe({
      next: (book) => {
        this.bookings = book
        this.bookings = this.bookings.data
      },
      error: (err) => {
        alert(err.error.message)
      }
    })

    this.data = user
  }


}
