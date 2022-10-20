import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-sign-upp',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private dialog: MatDialog
  ) { }
  newUser;

  ngOnInit()  {
    this.newUser = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: ''
    }
  }
  createUser(form: NgForm) {
    if(form.invalid){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Invalid input'}})
      return;
    }
    if(form.controls.password.value != form.controls.password_confirm.value){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Passwords do not match'}})
      return;
    }
    this.newUser = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
    }
    this.httpService.signUp(this.newUser);
  }
}
