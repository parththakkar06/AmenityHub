import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router } from '@angular/router';
import { SaveuserService } from '../../services/saveuser.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-book-amenity',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './book-amenity.component.html',
  styleUrl: './book-amenity.component.css'
})
export class BookAmenityComponent {

  amenityName: any = ''
  user: any
  data: any
  priceph : any
  constructor(private toast: ToastService, private book: BookingService, private route: Router, private saveUser: SaveuserService) {
    const nav = route.getCurrentNavigation()
    const data = nav?.extras?.state
    this.user = saveUser.getUser()
    this.amenityName = data
    //data.name ---> ameniity name
    //user.id ---> user id
  }

  bookingForm = new FormGroup({
    date: new FormControl('2026-04-03', [Validators.required]),
    startTime: new FormControl('13:25', [Validators.required]),
    endTime: new FormControl('14:25', [Validators.required])
  })

  get date() {
    return this.bookingForm.get('date')
  }

  get startTime() {
    return this.bookingForm.get('startTime')
  }

  get endTime() {
    return this.bookingForm.get('endTime')
  }

  showConfirm = false;
  title = '';
  time = '';
  amount = ''
  private confirmCallback: () => void = () => { };

  openConfirm(title: string, time: string, amount : string, callback: () => void) {
    this.title = title;
    this.time = time;
    this.amount = amount
    this.confirmCallback = callback;
    this.showConfirm = true;
  }

  onConfirm() {
    this.confirmCallback();
    this.showConfirm = false;
  }

  onCancel() {
    this.showConfirm = false;
  }


  beforeSubmit() {
    const startTime = this.bookingForm.value.startTime
    const endTime = this.bookingForm.value.endTime
    const date = this.bookingForm.value.date
    const combinedstart = `${date}T${startTime}`
    const start = new Date(combinedstart)
    const combinedend = `${date}T${endTime}`
    const end = new Date(combinedend)
    console.log(start, end)

    let bookingtime = (end.getTime() - start.getTime()) / 60000
    let hours
    let mins
    let amount : any
    this.priceph = this.amenityName.pricePerHour
    if (bookingtime > 59) {
      hours = Math.floor(bookingtime / 60)
      mins = bookingtime % 60
      console.log("hours..", hours, "..mins..", mins)
      // console.log(this.pricePerHour)
      amount = (hours * this.priceph) + (mins * ( this.priceph / 60))
      console.log(amount)
    } else {
      mins = bookingtime
    }
    this.openConfirm(
      'Confirm Booking?',
      `Total Time : ${hours ? hours+' hours' : ''} ${mins} mins` ,
      `Total Amount : ${amount}`
      ,
      () => {
        this.onSubmit(amount)
      }
    );

  }

  onSubmit(amount : any) {
    console.log(this.bookingForm.value)
    // console.log(this.user.id)
    this.data = { ...this.bookingForm.value, amenityName: this.amenityName, bookingAmount : amount }
    this.book.bookAmenity(this.user.id, this.data).subscribe({
      next: () => {
        this.toast.show('Booking Successfull', 'success')
        this.route.navigate(['/home'])
      },
      error: (e) => {
        this.toast.show(e.error.message, 'error')
      }
    })
  }


}
