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

    bookings: any[] = []
    activeBookings: any[] = []
    rejectedBookings: any[] = []
    pastbookings: any[] = []
    data: any

    private rawBookings: any[] = []
    private rawPastBookings: any[] = []

    ngOnInit() {
        const user = this.saveUser.getUserFromStorage()
        this.data = user
        if (!user || !user.id) return

        this.bookingService.getBookingById(user.id).subscribe({
            next: (book: any) => {
                this.rawBookings = (book && book.data && Array.isArray(book.data)) ? book.data : (Array.isArray(book) ? book : [])
                this.updateCategorizedBookings()
            },
            error: (err) => {
                console.error("Error fetching bookings:", err)
            }
        })

        this.bookingService.getPastBookingById(user.id).subscribe({
            next: (book: any) => {
                this.rawPastBookings = (book && book.data && Array.isArray(book.data)) ? book.data : (Array.isArray(book) ? book : [])
                this.updateCategorizedBookings()
            },
            error: (e) => {
                console.error("Error fetching past bookings:", e)
            }
        })
    }

    private updateCategorizedBookings() {
        // Collect all rejected bookings across active and past queries, deduplicated by _id
        const rejectedMap = new Map<string, any>()
        this.rawBookings.filter((b: any) => b.status === 'Rejected').forEach((b: any) => rejectedMap.set(b._id, b))
        this.rawPastBookings.filter((b: any) => b.status === 'Rejected').forEach((b: any) => rejectedMap.set(b._id, b))
        this.rejectedBookings = Array.from(rejectedMap.values())

        // Active reservations only contain non-rejected bookings
        this.activeBookings = this.rawBookings.filter((b: any) => b.status !== 'Rejected')
        this.bookings = this.activeBookings

        // Past reservations only contain non-rejected bookings
        this.pastbookings = this.rawPastBookings.filter((b: any) => b.status !== 'Rejected')
    }

    getAmenityImage(name: string, index: number = 0): string {
        const lower = (name || '').toLowerCase();
        if (lower.includes('swim') || lower.includes('pool')) {
          return 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80';
        } else if (lower.includes('gym') || lower.includes('fit') || lower.includes('workout')) {
          return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80';
        } else if (lower.includes('court') || lower.includes('tennis') || lower.includes('badminton') || lower.includes('volley') || lower.includes('squash')) {
          return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80';
        } else if (lower.includes('hall') || lower.includes('club') || lower.includes('lounge') || lower.includes('event')) {
          return 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80';
        } else {
          const fallbackImages = [
            'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80'
          ];
          return fallbackImages[index % fallbackImages.length];
        }
    }
}
