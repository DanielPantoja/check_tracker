import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, message: string, uId: string, jId: string, cId: string, eId: string}, public dialogRef: MatDialogRef<ValidatorComponent> ,private httpService: HttpService ) {}
  buttonText;

  ngOnInit(): void {
    if(this.data.title == 'Logging Out?'){
      this.buttonText = 'Confirm'
      return
    }
    else if(this.data.title == 'Deleting?'){
      this.buttonText = 'Yes Delete'
      return
    }
    this.buttonText = 'Alright'  
  }
  multiFunction(){
    if(this.data.title == 'Logging Out?'){
      this.httpService.logout();
      return
    }
    else if(this.data.title == 'Deleting'){
      if(this.data.message == 'Are you sure you want to delete this job?'){
        let obs = this.httpService.deleteJob(this.data.uId, this.data.jId);
        obs.subscribe(() => {
          console.log('this job has been deleted succesfully ')
          this.dialogRef.close()
        })
        return
      }
      else if(this.data.message == 'Are you sure you want to delete this check?' ){
        let obs = this.httpService.deleteCheck(this.data.cId, this.data.jId);
        obs.subscribe(() => {
          this.dialogRef.close()
        })
        return
      }
      else if(this.data.message == 'Are you sure you want to delete this entry?' ){
        console.log('made it to this point in the error component')
        let obs = this.httpService.deleteEntry(this.data.cId, this.data.eId);
        obs.subscribe(() => {
          this.dialogRef.close()
        })
        return
      }
    }
  }
}
