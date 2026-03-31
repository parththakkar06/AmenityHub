import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAmenityComponent } from './book-amenity.component';

describe('BookAmenityComponent', () => {
  let component: BookAmenityComponent;
  let fixture: ComponentFixture<BookAmenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAmenityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
