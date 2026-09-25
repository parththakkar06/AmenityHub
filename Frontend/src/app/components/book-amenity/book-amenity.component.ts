import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router } from '@angular/router';
import { SaveuserService } from '../../services/saveuser.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../services/toast.service';

interface TimeSlot {
  value: string;
  label: string;
}

interface CalendarDay {
  date: Date;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dateString: string;
}

@Component({
  selector: 'app-book-amenity',
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './book-amenity.component.html',
  styleUrl: './book-amenity.component.css'
})
export class BookAmenityComponent implements OnInit {

  amenityName: any = ''
  user: any
  data: any
  priceph : any

  // Custom Calendar State
  showCalendarPopup = false;
  currentCalendarMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  selectedDateFormatted = '';

  // 30-Minute Increment Time Slots
  timeSlots: TimeSlot[] = [];

  constructor(
    private toast: ToastService, 
    private book: BookingService, 
    private route: Router, 
    private saveUser: SaveuserService,
    private eRef: ElementRef
  ) {
    const nav = route.getCurrentNavigation();
    const data = nav?.extras?.state;
    this.user = saveUser.getUser() || saveUser.getUserFromStorage();
    const stateData: any = data || (typeof history !== 'undefined' ? history.state : null);
    this.amenityName = (stateData && stateData.name && stateData.name !== 'Amenity') ? stateData : (stateData?.amenity || { name: 'Amenity' });
  }

  ngOnInit(): void {
    if (!this.user) {
      this.user = this.saveUser.getUser() || this.saveUser.getUserFromStorage();
    }
    if ((!this.amenityName || !this.amenityName.name || this.amenityName.name === 'Amenity') && typeof history !== 'undefined' && history.state?.name) {
      this.amenityName = history.state;
    }

    this.generateCalendar();
    
    // Generate 30-min slots bounded by amenity opening/closing hours
    const openTime = this.amenityName?.availibility?.openingTime ?? 360;
    const closeTime = this.amenityName?.availibility?.closingTime ?? 1320;
    this.timeSlots = this.generate30MinSlots(openTime, closeTime);

    // Default to today's date if valid
    const today = new Date();
    const todayStr = this.formatDateToYYYYMMDD(today);
    this.bookingForm.patchValue({ date: todayStr });
    this.selectedDateFormatted = this.formatDisplayDate(today);
    if (this.user?.name) {
      this.cardDetails.holder = this.user.name;
    }
  }

  bookingForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    residentsCount: new FormControl(1, [Validators.required, Validators.min(1)]),
    guestsCount: new FormControl(0, [Validators.required, Validators.min(0)])
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

  get residentsCount() {
    return this.bookingForm.get('residentsCount')
  }

  get guestsCount() {
    return this.bookingForm.get('guestsCount')
  }

  incrementResidents(): void {
    const current = Number(this.residentsCount?.value) || 1;
    this.residentsCount?.setValue(current + 1);
  }

  decrementResidents(): void {
    const current = Number(this.residentsCount?.value) || 1;
    if (current > 1) {
      this.residentsCount?.setValue(current - 1);
    }
  }

  incrementGuests(): void {
    const current = Number(this.guestsCount?.value) || 0;
    this.guestsCount?.setValue(current + 1);
  }

  decrementGuests(): void {
    const current = Number(this.guestsCount?.value) || 0;
    if (current > 0) {
      this.guestsCount?.setValue(current - 1);
    }
  }

  get pricingCalculation() {
    const basePrice = Number(this.amenityName?.pricePerHour) || 200;
    const guestPriceRate = basePrice * 1.5;
    const residents = Math.max(1, Number(this.residentsCount?.value) || 1);
    const guests = Math.max(0, Number(this.guestsCount?.value) || 0);

    const startTime = this.bookingForm.value.startTime;
    const endTime = this.bookingForm.value.endTime;

    if (!startTime || !endTime || this.isTimeOrderInvalid) {
      return {
        hasValidTime: false,
        durationHours: 0,
        durationMinutes: 0,
        durationFormatted: '',
        basePrice,
        guestPriceRate,
        residents,
        guests,
        residentTotal: 0,
        guestTotal: 0,
        grandTotal: 0
      };
    }

    const date = this.bookingForm.value.date || '2000-01-01';
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const totalMinutes = Math.max(0, (end.getTime() - start.getTime()) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const durationDecimal = totalMinutes / 60;

    const residentTotal = Math.round(durationDecimal * basePrice * residents * 100) / 100;
    const guestTotal = Math.round(durationDecimal * guestPriceRate * guests * 100) / 100;
    const grandTotal = Math.round((residentTotal + guestTotal) * 100) / 100;

    const durationFormatted = `${hours ? hours + ' hr ' : ''}${mins ? mins + ' mins' : (hours ? '' : '0 mins')}`.trim();

    return {
      hasValidTime: true,
      totalMinutes,
      hours,
      mins,
      durationDecimal,
      durationFormatted,
      basePrice,
      guestPriceRate,
      residents,
      guests,
      residentTotal,
      guestTotal,
      grandTotal
    };
  }

  // Payment Gateway Modal State
  showPaymentModal = false;
  paymentState: 'select' | 'processing' | 'success' = 'select';
  selectedPaymentMethod: 'UPI' | 'Card' | 'Cash' = 'UPI';
  generatedTxnId = '';
  testUpiId = 'resident@okhdfcbank';
  cardDetails = {
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123',
    holder: 'Resident User'
  };
  processingStep = 'Connecting to payment gateway...';

  title = '';
  slotTime = '';
  duration = '';
  amount = '';
  confirmResidents = 1;
  confirmResidentAmount = '';
  confirmGuests = 0;
  confirmGuestAmount = '';
  numericAmount = 0;

  // Generate 30-Minute Increments Bounded by Amenity Hours
  generate30MinSlots(openingMinutes: number = 360, closingMinutes: number = 1320): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    let startMin = Number(openingMinutes);
    let endMin = Number(closingMinutes);

    if (isNaN(startMin)) startMin = 360;
    if (isNaN(endMin)) endMin = 1320;

    // Normalize if passed in 24h hours (<= 24)
    if (startMin <= 24) startMin = startMin * 60;
    if (endMin <= 24) endMin = endMin * 60;

    for (let m = startMin; m <= endMin; m += 30) {
      const hours24 = Math.floor(m / 60) % 24;
      const mins = m % 60;
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;
      
      const hh = hours24 < 10 ? `0${hours24}` : `${hours24}`;
      const mm = mins < 10 ? `0${mins}` : `${mins}`;
      const value = `${hh}:${mm}`;
      const label = `${hours12}:${mm} ${period}`;
      
      slots.push({ value, label });
    }
    return slots;
  }

  // Calendar Picker Toggle & Logic
  toggleCalendar(event: Event): void {
    event.stopPropagation();
    this.showCalendarPopup = !this.showCalendarPopup;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showCalendarPopup = false;
    }
  }

  prevMonth(event: Event): void {
    event.stopPropagation();
    this.currentCalendarMonth = new Date(
      this.currentCalendarMonth.getFullYear(),
      this.currentCalendarMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(event: Event): void {
    event.stopPropagation();
    this.currentCalendarMonth = new Date(
      this.currentCalendarMonth.getFullYear(),
      this.currentCalendarMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentCalendarMonth.getFullYear();
    const month = this.currentCalendarMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const days: CalendarDay[] = [];

    // Fill previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isToday: false,
        isPast: true,
        dateString: this.formatDateToYYYYMMDD(d)
      });
    }

    // Fill current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      d.setHours(0,0,0,0);
      days.push({
        date: d,
        dayNum: i,
        isCurrentMonth: true,
        isToday: d.getTime() === today.getTime(),
        isPast: d.getTime() < today.getTime(),
        dateString: this.formatDateToYYYYMMDD(d)
      });
    }

    this.calendarDays = days;
  }

  selectCalendarDay(day: CalendarDay, event: Event): void {
    event.stopPropagation();
    if (day.isPast) return;
    
    this.bookingForm.patchValue({ date: day.dateString });
    this.selectedDateFormatted = this.formatDisplayDate(day.date);
    this.showCalendarPopup = false;
  }

  formatDateToYYYYMMDD(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDisplayDate(d: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }

  formatTimeString(hhmm: string): string {
    if (!hhmm) return '';
    const [hStr, mStr] = hhmm.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mFormatted = m < 10 ? `0${m}` : `${m}`;
    return `${h12}:${mFormatted} ${period}`;
  }

  get isTimeOrderInvalid(): boolean {
    if (!this.startTime?.value || !this.endTime?.value) return false;
    return this.startTime.value >= this.endTime.value;
  }

  isSubmitting = false;

  selectPaymentMethod(method: 'UPI' | 'Card' | 'Cash'): void {
    this.selectedPaymentMethod = method;
  }

  fillDemoCard(): void {
    this.cardDetails = {
      number: '4242 4242 4242 4242',
      expiry: '12/28',
      cvv: '123',
      holder: this.user?.name || 'Demo Resident'
    };
    this.toast.show('Test Card details filled!', 'success');
  }

  closePaymentModal(): void {
    if (this.isSubmitting) return;
    this.showPaymentModal = false;
  }

  beforeSubmit(): void {
    if (this.isTimeOrderInvalid) {
      this.toast.show('End time must be after Start time', 'error');
      return;
    }

    const calc = this.pricingCalculation;
    if (!calc.hasValidTime || calc.grandTotal <= 0) {
      this.toast.show('Please select a valid time slot', 'error');
      return;
    }

    const startTime = this.bookingForm.value.startTime!;
    const endTime = this.bookingForm.value.endTime!;
    const startFormatted = this.formatTimeString(startTime);
    const endFormatted = this.formatTimeString(endTime);
    const slotTimeStr = `${startFormatted} - ${endFormatted}`;

    this.title = `Book ${this.amenityName?.name || 'Amenity'}`;
    this.slotTime = slotTimeStr;
    this.duration = calc.durationFormatted;
    this.amount = `₹${calc.grandTotal}`;
    this.numericAmount = calc.grandTotal;
    this.confirmResidents = calc.residents;
    this.confirmResidentAmount = `₹${calc.residentTotal}`;
    this.confirmGuests = calc.guests;
    this.confirmGuestAmount = `₹${calc.guestTotal}`;
    this.paymentState = 'select';
    this.showPaymentModal = true;
  }

  processPayment(): void {
    if (this.isSubmitting) return;

    if (!this.user) {
      this.user = this.saveUser.getUser() || this.saveUser.getUserFromStorage();
    }
    const userId = this.user?.id || this.user?._id || this.saveUser.getUserFromStorage()?.id;
    if (!userId) {
      this.toast.show('Please log in again to complete your booking.', 'error');
      this.route.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;

    this.data = {
      ...this.bookingForm.value,
      residentsCount: this.confirmResidents,
      guestsCount: this.confirmGuests,
      amenityName: this.amenityName,
      bookingAmount: this.numericAmount,
      paymentMethod: this.selectedPaymentMethod
    };

    this.book.bookAmenity(userId, this.data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showPaymentModal = false;
        this.toast.show(`Payment of ${this.amount} Successful! Booking Confirmed.`, 'success');
        this.route.navigate(['/mybookings']);
      },
      error: (e) => {
        this.isSubmitting = false;
        this.toast.show(e.error?.message || 'Booking or Payment Conflict. Please try another slot.', 'error');
      }
    });
  }

  navigateToBookings(): void {
    this.showPaymentModal = false;
    this.route.navigate(['/mybookings']);
  }

}
