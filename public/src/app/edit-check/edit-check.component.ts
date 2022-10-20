import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';
import { EditCheckModel } from './editcheck.model';

@Component({
  selector: 'app-edit-check',
  templateUrl: './edit-check.component.html',
  styleUrls: ['./edit-check.component.css'],
})
export class EditCheckComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}
  cId;
  jId;
  check
  updatedCheck: EditCheckModel = {
    start: null,
    end: null,
  };
  updatedCheck2: EditCheckModel = {
    start: null,
    end: null,
  };

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.cId = params['cId'];
      this.jId = params['jId'];
      this.createPlaceholder(params['cId']);
    });
  }
  createPlaceholder(cId){
    let obs = this.httpService.getOneCheck(cId);
    obs.subscribe(data => {
      let check= data['results'];
      console.log("CHECKDATA", check)
      this.updatedCheck.start = check.start;
      this.updatedCheck.end = check.end;
    })
  }
  editCheck(form:NgForm) {
    if(form.invalid) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Missing Input'}})
      return
    }
    if(new Date(form.controls['updatedCheck2.start'].value) > new Date(form.controls['updatedCheck2.end'].value) ){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'End date must be after start date'}})
      return
    }
    console.log("CHECK", this.updatedCheck)
    let obs = this.httpService.updateOneCheck(this.jId,this.cId,this.updatedCheck2);
    obs.subscribe((data) => {
      if(data['results']){
        console.log("THIS UPDATE WORKED")
        this.router.navigate(['CheckTracker/checks/',this.jId]);
      }
    });
  }
}
