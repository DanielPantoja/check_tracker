import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['error.component.css']
})
export class ErrorComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, message: string}, public dialogRef: MatDialogRef<ErrorComponent> ) {}
  buttonText = 'Alright';
}
