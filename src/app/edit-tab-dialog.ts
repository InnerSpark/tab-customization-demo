import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'edit-tab-dialog',
  template: `
    <h2 mat-dialog-title>Edit Tab Name</h2>
    <mat-dialog-content>
      <input matInput [(ngModel)]="tabName" aria-label="Tab name" />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!tabName.trim()">Save</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
})
export class EditTabDialog {
  tabName: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditTabDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { tabName: string }
  ) {
    this.tabName = data.tabName;
  }

  save() {
    this.dialogRef.close(this.tabName.trim());
  }

  close() {
    this.dialogRef.close();
  }
}
