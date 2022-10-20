import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../http.service';
import { ValidatorComponent } from '../validator/validator.component';
@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
    cId;
    check;
  ngOnInit(): void {
    this.route.params.subscribe((params : Params) => {
      this.cId = params['cId'];
      this.getCheck(params['cId']);
    })
  }
  getCheck(cId){
    let obs = this.httpService.getOneCheck(cId);
    obs.subscribe(data => {
      this.check = data['results']
    })
  }
  createEntry(form: NgForm){
    if(form.invalid) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Invalid Input'}})
      return
    }
    if(form.controls.minutes.value > 60) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Minutes cannot exceed 60'}})
      return
    }
    if(new Date(form.controls.date.value) > new Date(this.check.end) || new Date(form.controls.date.value) < new Date(this.check.start)){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error', message: 'Date must fall inbetween ' + this.check.start[0]+this.check.start[1]+this.check.start[2]+this.check.start[3]+this.check.start[4]+this.check.start[5]+this.check.start[6]+this.check.start[7]+this.check.start[8]+this.check.start[9]+" / "+this.check.end[0]+this.check.end[1]+this.check.end[2]+this.check.end[3]+this.check.end[4]+this.check.end[5]+this.check.end[6]+this.check.end[7]+this.check.end[8]+this.check.end[9] }})
      return
    }
    this.httpService.createEntry(form.value.hours, form.value.minutes, form.value.date, this.cId)
  }
}
