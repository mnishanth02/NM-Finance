import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

@Component({
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.css"],
})
export class ErrorComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onClose() {
    this.dialog.closeAll();
  }
}
