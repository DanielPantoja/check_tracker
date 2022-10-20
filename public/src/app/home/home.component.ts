import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private dialog: MatDialog,
  ) {}
  uId;
  jobsDataArr = [];
  earningTotal = 0;
  timeTotal = 0;
  
  ngOnInit() {
    this.uId = this.httpService.getUserId();
    this.onPopulateData(this.uId);
  }  
  onPopulateData(uId){
    let obs = this.httpService.getAllUserData(uId);
    obs.subscribe(data => {
      this.jobsDataArr = data['results']
      this.earningTotal = data['earningTotal'];
      this.timeTotal = data['timeTotal'];
      })
  }
  onDeleteJob(jId) {
    let dialogRef = this.dialog.open(ValidatorComponent, {data: {title: 'Deleting',message: 'Are you sure you want to delete this job?', uId: this.uId, jId: jId}})
    dialogRef.afterClosed().subscribe(() => {
      this.onPopulateData(this.uId);
    })
  }
}
