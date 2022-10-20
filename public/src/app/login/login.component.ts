import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private dialog: MatDialog
  ) { }
    newUser;
    
  ngOnInit(): void {
    this.newUser = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    }
  }
  onLogin(form: NgForm) {
    if (form.invalid) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Invalid Credentials'}})
      return;
    }
    this.httpService.login(form.value.email, form.value.password);
  }
}
