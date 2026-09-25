import { Component } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Router } from '@angular/router';
import { SaveuserService } from '../../services/saveuser.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  amenityList : any = ''
  expandedRules: { [key: number]: boolean } = {};

  constructor(private amenityService : AmenitiesService , private route : Router,private saveUser : SaveuserService){}

  ngOnInit(){
    const user = this.saveUser.getUser()
    if(user.bool == true){
      this.route.navigate(['/change-password'])
    }
    this.amenityService.getAmenities().subscribe((data)=>{
      this.amenityList = data.data
    })
  }

  showData(){
    console.log(this.amenityList[0])
  }

  bookNow(amenity: any){
    this.route.navigate(['/book-amenity'], { state: amenity })
  }

  toggleRules(index: number, event: Event): void {
    event.stopPropagation();
    this.expandedRules[index] = !this.expandedRules[index];
  }

  formatTime(val: any): string {
    if (val === undefined || val === null || val === '') return '';
    let num = Number(val);
    if (isNaN(num)) return String(val);

    // If hours are given in 24h format (<= 24, e.g. 6 or 22), convert to minutes
    if (num <= 24) {
      num = num * 60;
    }

    const hours24 = Math.floor(num / 60) % 24;
    const minutes = Math.floor(num % 60);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${hours12}:${minutesStr} ${period}`;
  }

  getAmenityImage(name: string, index: number): string {
    const lower = (name || '').toLowerCase();
    if (lower.includes('swim') || lower.includes('pool')) {
      return 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('gym') || lower.includes('fit') || lower.includes('workout')) {
      return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('court') || lower.includes('tennis') || lower.includes('badminton') || lower.includes('volley') || lower.includes('squash')) {
      return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('hall') || lower.includes('club') || lower.includes('lounge') || lower.includes('event')) {
      return 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80';
    } else {
      const fallbackImages = [
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
      ];
      return fallbackImages[index % fallbackImages.length];
    }
  }
}
