import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  job;
  updatedJob = {
    title: null,
    payrate: null,
    taxrate: null,
  }

  ngOnInit(): void {
    this.route.params.subscribe((params : Params) => {
      this.createPlaceholder(params['jId'])
    })
  }
  createPlaceholder(jId){
    let obs = this.httpService.getOneJob(jId);
    obs.subscribe(data => {
      this.job = data['results']
      this.updatedJob.title = this.job.title
      this.updatedJob.payrate = this.job.payrate
      this.updatedJob.taxrate = this.job.taxrate
    })
  }
  editJob(form:NgForm){
    if(form.invalid) {
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Invalid Input'}})
      return
    }
    if(form.controls['updatedJob.payrate'].value < 0){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Pay Rate Must Be Over $0'}})
      return
    }
    if(form.controls['updatedJob.taxrate'].value > 100){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Tax Rate Cannot Exceed 100%'}})
      return
    }
    let jId = this.job._id
    let uId = this.httpService.getUserId();
    let obs = this.httpService.updateOneJob(uId, jId, this.updatedJob)
    obs.subscribe(data => {
      if(data['results']){
        this.router.navigate(['/home'])
      }
    })
  }
}
