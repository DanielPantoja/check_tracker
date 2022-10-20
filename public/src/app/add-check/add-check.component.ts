import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params} from '@angular/router';
import { HttpService } from '../http.service';
import { ValidatorComponent } from '../validator/validator.component';

@Component({
  selector: 'app-add-check',
  templateUrl: './add-check.component.html',
  styleUrls: ['./add-check.component.css']
})
export class AddCheckComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  jId;

  ngOnInit(): void {
    this.route.params.subscribe((params : Params) => {
      this.jId = params['jId'];
    })
  }
  createCheck(form: NgForm){
    if(form.invalid){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'Invalid Input'}})
      return
    }
    if(new Date(form.controls.start.value) > new Date(form.controls.end.value) ){
      this.dialog.open(ValidatorComponent, {data: {title: 'There Has Been An Error',message: 'End date must be after start date'}})
      return
    }
    this.httpService.createCheck(form.value.start, form.value.end, this.jId )
  }
}
