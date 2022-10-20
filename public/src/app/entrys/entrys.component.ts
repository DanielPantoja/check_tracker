import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ValidatorComponent } from '../validator/validator.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-entrys',
  templateUrl: './entrys.component.html',
  styleUrls: ['./entrys.component.css']
})
export class EntrysComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  cId;
  entrys = [];
  earningTotal;
  timeTotal;

  ngOnInit(): void {
    this.route.params.subscribe((params : Params) => {
      this.cId =(params['cId'])
      this.onPopulateData(params['cId'])
    })
  }
  onPopulateData(cId){
    let obs = this.httpService.getCheckData(cId);
    obs.subscribe(data => {
      this.entrys = data['results']
      this.earningTotal = data['earningTotal'];
      this.timeTotal = data['timeTotal'];
    })
  }
  onDeleteEntry(eId){
    let dialogRef = this.dialog.open(ValidatorComponent,{data: {title: 'Deleting',message: 'Are you sure you want to delete this entry?', cId: this.cId, eId: eId}})
    dialogRef.afterClosed().subscribe(() => {
      this.onPopulateData(this.cId);
    })
  }
}
