import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-checks',
  templateUrl: './checks.component.html',
  styleUrls: ['./checks.component.css']
})
export class ChecksComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  job;
  checks = [];
  earningTotal = 0;
  timeTotal = 0;

  ngOnInit(): void {
    this.route.params.subscribe((params : Params) => {
      this.onPopulateData(params["jId"]);
    });
  }
  onPopulateData(jId){
    let obs = this.httpService.getJobData(jId);
    obs.subscribe(data => {
      this.job = data['results'];
      this.checks = data['checkArray']
      this.earningTotal = data['earningTotal'];
      this.timeTotal = data['timeTotal'];
    })
  }
  onDeleteCheck(cId){
    let dialogRef = this.dialog.open(ValidatorComponent, {data: {title: 'Deleting',message: 'Are you sure you want to delete this check?', cId: cId, jId: this.job._id}});
    dialogRef.afterClosed().subscribe(() => {
      this.onPopulateData(this.job._id);
    })
  }
}
