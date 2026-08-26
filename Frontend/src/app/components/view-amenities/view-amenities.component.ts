import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-view-amenities',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-amenities.component.html',
  styleUrl: './view-amenities.component.css'
})
export class ViewAmenitiesComponent implements OnInit {
  amenities: any[] = []

  constructor(
    private location: Location,
    private amenityService: AmenitiesService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAmenities()
  }

  deleteAmenity(id: string) {
    this.amenityService.deleteAmenity(id).subscribe(() => {
      this.getAmenities()
    })
  }

  getAmenities() {
    this.amenityService.getAmenities().subscribe({
      next: (res: any) => {
        console.log("Raw API response:", res)
        if (res && res.data && Array.isArray(res.data)) {
          this.amenities = res.data
        } else if (Array.isArray(res)) {
          this.amenities = res
        } else {
          this.amenities = []
        }
        console.log("Assigned amenities array:", this.amenities)
        this.cdr.detectChanges()
      },
      error: (err: any) => {
        console.error("Error fetching amenities:", err)
      }
    })
  }

  back() {
    this.location.back()
  }

  editAmenity(amenity: object, id: string) {
    this.route.navigate(['/dashboard/add-amenity'], { state: { amenity, id } })
  }

  formatTime(minutes: number): string {
    if (minutes === undefined || minutes === null) return '00:00'
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    const formattedHrs = hrs < 10 ? `0${hrs}` : `${hrs}`
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`
    return `${formattedHrs}:${formattedMins}`
  }
}
