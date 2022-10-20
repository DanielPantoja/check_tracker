import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../http.service';
import { ValidatorComponent } from '../validator/validator.component';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  createJob(form: NgForm){
    if(form.invalid) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Invalid Input'}})
      return
    }
    if(form.controls.payrate.value < 0){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Pay Rate Must Be Over $0'}})
      return
    }
    if(form.controls.taxrate.value > 100){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Tax Rate Cannot Exceed 100%'}})
      return
    }
    this.httpService.createJob(form.value.title, form.value.payrate, form.value.taxrate);
  }
}

