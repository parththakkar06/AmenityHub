import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { SaveuserService } from '../../services/saveuser.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule , MatToolbarModule , MatButtonModule,MatMenuModule,MatIconModule , RouterLink , RouterLinkActive , NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  
  constructor(private saveUser : SaveuserService, private route : Router){}
  private subscription : Subscription = new Subscription()
  user : any = null

  ngOnInit(){
    this.subscription = this.saveUser.user$.subscribe(data => {
      this.user = data
      console.log(data)
    })
  }

  logout(){
    this.saveUser.clearUser()
    this.route.navigate(['/login'])
  }


}
