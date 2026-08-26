import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-registered-users',
  imports: [CommonModule],
  templateUrl: './registered-users.component.html',
  styleUrl: './registered-users.component.css'
})
export class RegisteredUsersComponent implements OnInit {
  users: any[] = []

  constructor(
    private location: Location,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.getusers().subscribe({
      next: (u: any) => {
        if (u && u.data && Array.isArray(u.data)) {
          this.users = u.data
        } else if (Array.isArray(u)) {
          this.users = u
        } else {
          this.users = []
        }
        console.log("Fetched users:", this.users)
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error("Error fetching users:", err)
      }
    })
  }

  back() {
    this.location.back()
  }
}
