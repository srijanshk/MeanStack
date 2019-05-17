import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

 
  public loading = false;

  fileToUpload: File = null;

  constructor(
    private service: EmployeeService,
    private dialogRef: MatDialogRef<ImportComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    public snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

upload() {
  this.service.ImportEmployee(this.fileToUpload)
  .subscribe(data => {
    this.snackbar.open('Imported Successfully', 'Close', {
      duration: 3000,
    });
  }, error => {
    this.loading = false;
    this.snackbar.open('Unsuccessful', 'Close', {
      duration: 3000,
    });  })
    this.closeDialog();

}
closeDialog = function() {
  this.dialogRef.close();
};

}




