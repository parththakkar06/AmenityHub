import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-mybookings',
  imports: [],
  templateUrl: './mybookings.component.html',
  styleUrl: './mybookings.component.css'
})
export class MybookingsComponent {

  constructor(private route : Router , private bookingService : BookingService){}

  ngOnInit(){
    // this.bookingService.getBookingById(id)
  }

}
