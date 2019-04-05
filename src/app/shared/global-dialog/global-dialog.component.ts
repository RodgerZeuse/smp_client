import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';
export interface DialogData {
  Confirm: boolean
}
@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.css']
})
export class GlobalDialogComponent {
  form: FormGroup;
  dialogType: string = 'alertdialog';
  heading: string = '';
  description: string = '';
  inputHeading: string = '';
  actionButtonText: string = '';
  detailsArray: Array<string>=[];
  network :any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GlobalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.dialogType = data.type,
      this.heading = data.heading,
      this.description = data.description
      this.inputHeading = data.inputHeading,
      this.actionButtonText = data.actionButtonText
      this.detailsArray= data.detailsArray
  }

  ngOnInit() {
    this.form = this.fb.group({
      inputValue: [this.description, []],
    });
  }

  save() {
    if(this.inputHeading){
      this.dialogRef.close(this.form.value);
    }else{
      this.dialogRef.close(true);
    }
    
  }

  close() {
    this.dialogRef.close('close');
  }
}
