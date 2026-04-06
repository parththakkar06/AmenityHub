import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenityUtilizationComponent } from './amenity-utilization.component';

describe('AmenityUtilizationComponent', () => {
  let component: AmenityUtilizationComponent;
  let fixture: ComponentFixture<AmenityUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenityUtilizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenityUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
