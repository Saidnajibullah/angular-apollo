import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-users.component.html',
  styleUrl: './display-users.component.scss'
})
export class DisplayUsersComponent {
  @Input() users: any[] = [];
  @Input()
  set newUser(user: any){
    if(user) this.users = [...this.users, user]
  }
}
