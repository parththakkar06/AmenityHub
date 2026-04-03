import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueByAmenityComponent } from './revenue-by-amenity.component';

describe('RevenueByAmenityComponent', () => {
  let component: RevenueByAmenityComponent;
  let fixture: ComponentFixture<RevenueByAmenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueByAmenityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueByAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
