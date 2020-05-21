import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you Sure ?</h1>
                <mat-dialog-content>
                <p>You want to delete Loan Details of {{passedData.userName}} </p>
                </mat-dialog-content>
                <mat-dialog-actions>
                  <button mat-button (click)="delete()">Yes</button>
                  <button mat-button (click)="close()">No</button>
                </mat-dialog-actions>`
})
export class DeleteLoanDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  close() {
    this.dialogRef.close();
  }
  delete() {
    this.dialogRef.close(true);
  }
}
