import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-booking',
  imports: [CommonModule],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css'
})
export class AdminBookingComponent implements OnInit {
  bookings: any[] = []
  activeTab = 'all'
  totalbookings: any = 0
  approvedbookings: any = 0
  rejectedbookings: any = 0

  constructor(
    private location: Location,
    private bookingService: BookingService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getBookings()
  }

  back() {
    this.location.back()
  }

  sendStatus(id: string, stat: string) {
    if (stat === 'accept') {
      const status = { status: "Accepted" }
      this.bookingService.sendStatus(id, status).subscribe(() => {
        this.getBookings()
      })
    }

    if (stat === 'reject') {
      const status = { status: "Rejected" }
      this.bookingService.sendStatus(id, status).subscribe(() => {
        this.getBookings()
      })
    }
  }

  getBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (book: any) => {
        if (book && book.data && Array.isArray(book.data)) {
          this.bookings = book.data
        } else if (Array.isArray(book)) {
          this.bookings = book
        } else {
          this.bookings = []
        }
        console.log("Fetched bookings:", this.bookings)
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error("Error fetching bookings:", err)
      }
    })

    this.bookingService.getApprovedBookings().subscribe({
      next: (count: any) => {
        this.approvedbookings = typeof count === 'number' ? count : (count?.bookings || count?.count || 0)
        this.cdr.detectChanges()
      }
    })

    this.bookingService.getRejectedBookings().subscribe({
      next: (count: any) => {
        this.rejectedbookings = typeof count === 'number' ? count : (count?.data || count?.count || 0)
        this.cdr.detectChanges()
      }
    })

    this.bookingService.getBookingsCount().subscribe({
      next: (count: any) => {
        this.totalbookings = typeof count === 'number' ? count : (count?.count || 0)
        this.cdr.detectChanges()
      }
    })
  }
}
