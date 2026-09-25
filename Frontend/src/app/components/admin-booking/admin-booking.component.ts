import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-booking',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css'
})
export class AdminBookingComponent implements OnInit {
  bookings: any[] = []
  activeTab = 'all'
  totalbookings: any = 0
  approvedbookings: any = 0
  rejectedbookings: any = 0

  // Cancellation Modal state
  showRejectModal = false
  selectedBookingForReject: any = null
  rejectReason = ''
  rejectReasonError = ''
  isSubmittingReject = false

  presetReasons: string[] = [
    'Facility Under Maintenance',
    'Schedule Conflict',
    'Society Event Scheduled',
    'Payment / Verification Issue',
    'Amenity Policy Violation'
  ]

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

  openRejectModal(booking: any) {
    this.selectedBookingForReject = booking
    this.rejectReason = ''
    this.rejectReasonError = ''
    this.isSubmittingReject = false
    this.showRejectModal = true
    this.cdr.detectChanges()
  }

  closeRejectModal() {
    this.showRejectModal = false
    this.selectedBookingForReject = null
    this.rejectReason = ''
    this.rejectReasonError = ''
    this.isSubmittingReject = false
    this.cdr.detectChanges()
  }

  selectPresetReason(reason: string) {
    this.rejectReason = reason
    this.rejectReasonError = ''
    this.cdr.detectChanges()
  }

  confirmReject() {
    const trimmed = this.rejectReason.trim()
    if (!trimmed) {
      this.rejectReasonError = 'Please provide or select a cancellation reason.'
      return
    }
    if (trimmed.length < 3) {
      this.rejectReasonError = 'Cancellation reason must be at least 3 characters.'
      return
    }

    if (!this.selectedBookingForReject?._id) return

    this.isSubmittingReject = true
    const payload = {
      status: 'Rejected',
      cancelReason: trimmed,
      rejectionReason: trimmed
    }

    this.bookingService.sendStatus(this.selectedBookingForReject._id, payload).subscribe({
      next: () => {
        this.closeRejectModal()
        this.getBookings()
      },
      error: (err) => {
        console.error('Error rejecting booking:', err)
        this.rejectReasonError = 'Failed to reject booking. Please try again.'
        this.isSubmittingReject = false
        this.cdr.detectChanges()
      }
    })
  }

  sendStatus(id: string, stat: string) {
    if (stat === 'accept') {
      const status = { status: "Accepted" }
      this.bookingService.sendStatus(id, status).subscribe(() => {
        this.getBookings()
      })
    }

    if (stat === 'reject') {
      const booking = this.bookings.find(b => b._id === id)
      if (booking) {
        this.openRejectModal(booking)
      } else {
        this.openRejectModal({ _id: id })
      }
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
