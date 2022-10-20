import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.css']
})
export class EditEntryComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }
  entry;
  check;
  updatedEntry = {
    hours: null,
    minutes: null,
    date: null
  }
  eId;
  ngOnInit() {
    this.route.params.subscribe((params : Params) => {
      this.eId = params['eId']
      this.createPlaceholder(params['eId'])
    })
  }
  editEntry(form: NgForm){
    if(form.invalid) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Missing Input'}})
      return
    }
    if(form.controls['updatedEntry.minutes'].value > 60) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Minutes cannot exceed 60'}})
      return
    }
    if(new Date(form.controls['updatedEntry.date'].value) > new Date(this.check.end) || new Date(form.controls['updatedEntry.date'].value) < new Date(this.check.start)){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error', message: 'Date must fall inbetween ' + this.check.start[0]+this.check.start[1]+this.check.start[2]+this.check.start[3]+this.check.start[4]+this.check.start[5]+this.check.start[6]+this.check.start[7]+this.check.start[8]+this.check.start[9]+" / "+this.check.end[0]+this.check.end[1]+this.check.end[2]+this.check.end[3]+this.check.end[4]+this.check.end[5]+this.check.end[6]+this.check.end[7]+this.check.end[8]+this.check.end[9] }})
      return
    }
    let obs = this.httpService.updateOneEntry(this.eId, this.updatedEntry);
    obs.subscribe(data => {
      console.log("DATAFROEDITENTRY", data)
      this.router.navigate(['CheckTracker/entrys/',this.check._id])
    })
  }
  createPlaceholder(eId){
    let obs = this.httpService.getOneEntry(eId);
    obs.subscribe(data => {
      this.entry = data['results']
      this.updatedEntry.hours = this.entry.hours
      this.updatedEntry.minutes = this.entry.minutes
      let obss = this.httpService.getOneCheck(data['results']['checkId']);
      obss.subscribe(data => {
        this.check = data['results']
    })
    })
  }
}
