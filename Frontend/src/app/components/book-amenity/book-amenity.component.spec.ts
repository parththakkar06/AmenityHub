import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { BookAmenityComponent } from './book-amenity.component';

describe('BookAmenityComponent', () => {
  let component: BookAmenityComponent;
  let fixture: ComponentFixture<BookAmenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAmenityComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAmenityComponent);
    component = fixture.componentInstance;
    component.amenityName = { name: 'Tennis Court', pricePerHour: 200 };
    fixture.detectChanges();
  });

  it('should create with default 1 resident and 0 guests', () => {
    expect(component).toBeTruthy();
    expect(component.residentsCount?.value).toBe(1);
    expect(component.guestsCount?.value).toBe(0);
  });

  it('should increment and decrement residents and guests within bounds', () => {
    component.incrementResidents();
    expect(component.residentsCount?.value).toBe(2);
    component.decrementResidents();
    expect(component.residentsCount?.value).toBe(1);
    // Should not decrement below 1
    component.decrementResidents();
    expect(component.residentsCount?.value).toBe(1);

    component.incrementGuests();
    expect(component.guestsCount?.value).toBe(1);
    component.decrementGuests();
    expect(component.guestsCount?.value).toBe(0);
    // Should not decrement below 0
    component.decrementGuests();
    expect(component.guestsCount?.value).toBe(0);
  });

  it('should correctly calculate dynamic pricing with 1.5x guest multiplier', () => {
    component.amenityName = { name: 'Tennis Court', pricePerHour: 200 };
    component.bookingForm.patchValue({
      date: '2026-10-15',
      startTime: '10:00',
      endTime: '12:00',
      residentsCount: 2,
      guestsCount: 1
    });

    // 2 hours duration:
    // Residents: 2 residents * (2 hours * 200) = 800
    // Guests: 1 guest * (2 hours * 300) = 600
    // Grand Total: 1400
    const calc = component.pricingCalculation;
    expect(calc.hasValidTime).toBeTrue();
    expect(calc.durationDecimal).toBe(2);
    expect(calc.residentTotal).toBe(800);
    expect(calc.guestTotal).toBe(600);
    expect(calc.grandTotal).toBe(1400);
  });

  it('should open payment modal in select state on valid beforeSubmit()', () => {
    component.bookingForm.patchValue({
      date: '2026-10-15',
      startTime: '10:00',
      endTime: '12:00',
      residentsCount: 1,
      guestsCount: 0
    });

    component.beforeSubmit();
    expect(component.showPaymentModal).toBeTrue();
    expect(component.paymentState).toBe('select');
    expect(component.selectedPaymentMethod).toBe('UPI');
    expect(component.amount).toBe('₹400');
  });

  it('should allow switching payment methods and filling demo card', () => {
    component.selectPaymentMethod('Card');
    expect(component.selectedPaymentMethod).toBe('Card');

    component.fillDemoCard();
    expect(component.cardDetails.number).toBe('4242 4242 4242 4242');
    expect(component.cardDetails.cvv).toBe('123');

    component.selectPaymentMethod('Cash');
    expect(component.selectedPaymentMethod).toBe('Cash');
  });

  it('should process payment and navigate to /mybookings instantly on success', () => {
    const bookingService = TestBed.inject(BookingService);
    const router = TestBed.inject(Router);
    spyOn(bookingService, 'bookAmenity').and.returnValue(of({ message: 'Success', data: {} }));
    const navigateSpy = spyOn(router, 'navigate');

    component.user = { id: 'user123', name: 'Test User' };
    component.numericAmount = 400;
    component.amount = '₹400';
    component.confirmResidents = 1;
    component.confirmGuests = 0;
    component.selectedPaymentMethod = 'UPI';

    component.processPayment();

    expect(bookingService.bookAmenity).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
    expect(component.showPaymentModal).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/mybookings']);
  });
});

