import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormServices } from '../../services/form';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {


  public loading = false;
  public submitted = false;
  formErrors = {
    fullname: '',
    DOB: '',
    gender: '',
    salary: '',
    designation: '',
  };
  public profilePicture: any = this.service.form.value.profilePicture;
  public photo: any = '';
  public picture: any = '';
  fileToUpload: File ;
  modes: any;



  constructor(
    public form: FormBuilder,
    public formService: FormServices,
    public snackbar: MatSnackBar,
    private router: Router,
    public service: EmployeeService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: any,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.modes = this.mode;
    console.log(this.modes);
   }


  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.formService.markFormGroupTouched(this.service.form);
    if (this.service.form.valid) {
      if (!this.service.form.get('_id').value) {
        const fullname = this.service.form.value.fullname;
        const gender = this.service.form.value.gender;
        const DOB = this.service.form.value.DOB;
        const salary = this.service.form.value.salary;
        const designation = this.service.form.value.designation;
        const formData: FormData = new FormData();
        formData.append('fullname', fullname);
        formData.append('DOB', DOB);
        formData.append('salary', salary);
        formData.append('gender', gender);
        formData.append('designation', designation);
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
        this.service.AddNewEmployee(formData)
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
      } else {
        const fullname = this.service.form.value.fullname;
        const gender = this.service.form.value.gender;
        const DOB = this.service.form.value.DOB;
        const salary = this.service.form.value.salary;
        const designation = this.service.form.value.designation;
        const formData: FormData = new FormData();
        formData.append('fullname', fullname);
        formData.append('DOB', DOB);
        formData.append('salary', salary);
        formData.append('gender', gender);
        formData.append('designation', designation);
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
        this.service.EditEmployee(this.service.form.get('_id').value, formData)
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
          )
      }
    } else {
      this.formErrors = this.formService.validateForm(this.service.form, this.formErrors, false);
    }
    this.closeDialog();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload.size)
  }

  closeDialog = function () {
    this.dialogRef.close();
  };

  clearForm = function () {
    this.service.form.reset();
    this.service.initializeFormGroup();
  };


  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.photo = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.photo = event.target.files;
      this.picture = this.photo;
    }
    this.handleFileInput(this.picture);
  }



}
