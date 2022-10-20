import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-all-checks',
  templateUrl: './all-checks.component.html',
  styleUrls: ['./all-checks.component.css']
})
export class AllChecksComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private dialog: MatDialog
    ) { }
    earningTotal = 0;
    timeTotal = 0;
    allChecks = [];
    uId;
    ngOnInit(): void {
      this.uId = this.httpService.getUserId()
      this.onGetEarningAndTimeTotal(this.uId);
      this.populateData(this.uId)
  }
  populateData(uId){
    let obs = this.httpService.getAllChecks(uId);
    obs.subscribe((data => {
      this.allChecks = data['results']
    }))
  }
  onGetEarningAndTimeTotal(uId){
    let obs = this.httpService.getAllUserData(uId);
      obs.subscribe(data => {
        this.earningTotal = data['earningTotal'];
        this.timeTotal = data['timeTotal'];
      })
    }
    onDeleteCheck(cId, jId){
      let dialogRef = this.dialog.open(ValidatorComponent, {data: {title: 'Deleting',message: 'Are you sure you want to delete this check?', cId: cId, jId: jId}});
      dialogRef.afterClosed().subscribe(()=> {
        this.onGetEarningAndTimeTotal(this.uId)
        this.populateData(this.uId)
      })
    }
  }

