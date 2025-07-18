import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AddUserComponent } from './add-user/add-user.component';
import { DisplayUsersComponent } from './display-users/display-users.component';
interface User{
  name?: string
  email?: string
  zip?:number
}
interface UserData{
  onUserAdded: User
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddUserComponent, DisplayUsersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  users: any;
  newUser: any;
  constructor(private readonly apollo: Apollo){}
  title = 'angular-graphql';
  NEW_USER = gql`
    subscription newUser {
      onUserAdded {
        name email zip
      }
    }
    `;
    GET_USERS = gql`
      {
        getUsers {
          email
          name
          zip
          postedPhotos {
            url
            description
            size
          }
        }
      }
    `
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: this.GET_USERS
    }).valueChanges.subscribe(res =>{
      const data: any = res.data;
      this.users = data.getUsers;
    });
    this.apollo.subscribe<UserData>({
      query: this.NEW_USER,
    }).subscribe((result) => {
      if (result.data) {
        console.log(result.data)
        this.newUser = result.data.onUserAdded;
      }
    });
  }
}
