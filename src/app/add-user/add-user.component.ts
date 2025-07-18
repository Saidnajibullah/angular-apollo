import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  userForm: any;
  constructor(private readonly apollo: Apollo, private readonly fb: FormBuilder){
    this.userForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      zip: ['', Validators.required]
    })
  }
  ADD_USER = gql`
    mutation($user: userInput!){
    addUser(user: $user)
  }
  `
  addNewUser(){
    this.apollo.mutate({
      mutation: this.ADD_USER,
      variables:{
        "user": this.userForm.value
      }
    }).subscribe()
  }
}
