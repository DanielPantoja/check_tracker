import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../http.service';
import { ValidatorComponent } from '../validator/validator.component';

@Component({
  selector: 'app-all-entrys',
  templateUrl: './all-entrys.component.html',
  styleUrls: ['./all-entrys.component.css']
})
export class AllEntrysComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private dialog: MatDialog
  ) { }
  earningTotal = 0;
  timeTotal = 0;
  entrys = [];
  uId;
  ngOnInit(): void {
    this.uId = this.httpService.getUserId();
    this.onPopulateData(this.uId);
    this.onGetEntrysEarningTimeTotal(this.uId);
  }
  onPopulateData(uId) {
    let obs = this.httpService.getAllEntrys(uId);
    obs.subscribe(data => {
      this.entrys = data['results']
    })
  }
  onGetEntrysEarningTimeTotal(uId) {
    let obs = this.httpService.getAllUserData(uId);
    obs.subscribe((data) => {
      this.earningTotal = data['earningTotal'];
      this.timeTotal = data['timeTotal'];
    })
  }
  onDeleteEntry(eId) {
    let dialogRef = this.dialog.open(ValidatorComponent, { data: { title: 'Deleting', message: 'Are you sure you want to delete this entry?', eId: eId } })
    dialogRef.afterClosed().subscribe(() => {
      this.onPopulateData(this.uId)
      this.onGetEntrysEarningTimeTotal(this.uId);
    })
  }
}
