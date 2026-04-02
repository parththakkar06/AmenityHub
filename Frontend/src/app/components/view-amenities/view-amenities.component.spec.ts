import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAmenitiesComponent } from './view-amenities.component';

describe('ViewAmenitiesComponent', () => {
  let component: ViewAmenitiesComponent;
  let fixture: ComponentFixture<ViewAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAmenitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
