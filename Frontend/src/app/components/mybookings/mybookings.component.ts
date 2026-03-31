import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SaveuserService } from '../../services/saveuser.service';

@Component({
  selector: 'app-mybookings',
  imports: [],
  templateUrl: './mybookings.component.html',
  styleUrl: './mybookings.component.css'
})
export class MybookingsComponent {

  constructor(private route : Router , private bookingService : BookingService , private saveUser : SaveuserService){}

  mybookings : any = ''
  ngOnInit(){
    const user = this.saveUser.getUserFromStorage()
    this.bookingService.getBookingById(user.id).subscribe({
      next : (book) => {
        this.mybookings = book
      },
      error : (err) => {
        alert(err.error.message)
      }
    })
  }

  getbookings(){
    console.log(this.mybookings)
  }

}
