import { ChangeDetectorRef, Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-booking',
  imports: [CommonModule],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css'
})
export class AdminBookingComponent {
  bookings: any
  activeTab = 'all'
  totalbookings: any
  approvedbookings: any
  rejectedbookings: any

  constructor(private location : Location,private bookingService: BookingService , private route : Router , private cdr : ChangeDetectorRef) { }

  ngOnInit() {
    this.bookingService.getAllBookings().subscribe({
      next: (book) => {
        this.bookings = book
        console.log(book)
        this.bookings = this.bookings.data
      }
    })

    this.bookingService.getApprovedBookings().subscribe({
      next: (count) => {
        this.approvedbookings = count
        this.approvedbookings = this.approvedbookings.bookings
      }
    })

    this.bookingService.getRejectedBookings().subscribe({
      next: (count) => {
        this.rejectedbookings = count
        this.rejectedbookings = this.rejectedbookings.data
        console.log(count)
      }
    })

    this.bookingService.getBookingsCount().subscribe({
      next: (count) => {
        this.totalbookings = count
        this.totalbookings = this.totalbookings.count
      }
    })
  }

  back(){
    this.location.back()
  }
  sendStatus(id: string, stat: string) {
    if (stat === 'accept') {
      const status = { status: "Accepted" }
      this.bookingService.sendStatus(id,status).subscribe(()=>{
        this.getBookings()
      })
    }

    if (stat === 'reject') {
      const status = { status: "Rejected" }
      this.bookingService.sendStatus(id,status).subscribe(()=>{
        this.getBookings()
      })
    }
  }


  getBookings(){
    this.bookingService.getAllBookings().subscribe({
      next: (book) => {
        this.bookings = book
        console.log(book)
        this.bookings = this.bookings.data
      }
    })
        this.bookingService.getApprovedBookings().subscribe({
      next: (count) => {
        this.approvedbookings = count
        this.approvedbookings = this.approvedbookings.bookings
      }
    })

    this.bookingService.getRejectedBookings().subscribe({
      next: (count) => {
        this.rejectedbookings = count
        this.rejectedbookings = this.rejectedbookings.data
        console.log(count)
      }
    })

    this.bookingService.getBookingsCount().subscribe({
      next: (count) => {
        this.totalbookings = count
        this.totalbookings = this.totalbookings.count
      }
    })
  }
}
