import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormServices } from 'src/app/services/form';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  public loading = false;
  public submitted = false;
  formErrors = {
    fullname : '',
    DOB: '',
    gender: '',
    salary: '',
    designation: '',
  };
  public profilePicture: any='';
  public picture: any='';


  constructor(
    public form: FormBuilder,
    public formService: FormServices,
    public snackbar: MatSnackBar,
    private router: Router,
    private service: EmployeeService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  public EmployeeForm: FormGroup;

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.formService.markFormGroupTouched(this.service.form);
    if (this.service.form.valid) {
      if(!this.service.form.get('id').value)
      {
       this.service.AddNewEmployee(this.service.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.snackbar.open('Employee has been Added', 'Close', {
            duration: 3000,
          });
        },
        error => {
          this.loading = false;
          this.snackbar.open('Unsuccessful', 'Close', {
            duration: 3000,
          });
        },
      );
      } else{
        this.service.EditEmployee(this.service.form.get('_id').value, this.service.form.value)
        .pipe(first())
        .subscribe(
          data => {
            this.snackbar.open('Employee has been Updated', 'Close', {
              duration: 3000,
            });
          },
          error => {
            this.loading = false;
            this.snackbar.open('Unsuccessful', 'Close', {
              duration: 3000,
            });
          },
        );
      }
      this.closeDialog();
    } 
    else {
      this.formErrors = this.formService.validateForm(this.service.form, this.formErrors, false);
    }
  }

  closeDialog = function() {
    this.dialogRef.close();
  };

  clearForm = function() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Submitted successfully');
  };

  onSelectFile(event:any){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload =(event: ProgressEvent) =>{
        this.profilePicture = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.profilePicture = event.target.files;
    }
}



}
