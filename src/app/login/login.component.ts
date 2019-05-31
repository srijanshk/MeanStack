import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FormServices } from '../services/form';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public formErrors = {
    username: '',
    password: '',
  };

  constructor(
    public fb: FormBuilder,
    public authservice: AuthenticationService,
    public router: Router,
    public FormService: FormServices,
    public snackbar: MatSnackBar
  ) { }

  public onSubmit(username, password) {
    this.submitted = true;

    this.FormService.markFormGroupTouched(this.loginForm);

    if (this.loginForm.valid) {
      this.authservice.login(username, password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/dashboard']);
          this.snackbar.open('Successfully Loggedin', 'Close', {
            duration: 3000,
          });
        },
        error => {
          this.loading = false;
          this.snackbar.open('Username/password not mathched', 'Close', {
            duration: 3000,
          });
          }
        );

    } else {
      this.formErrors = this.FormService.validateForm(this.loginForm, this.formErrors, false);
    }
  }

  public buildForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.loginForm.valueChanges.subscribe((data) => {
      this.formErrors = this.FormService.validateForm(this.loginForm, this.formErrors, true);
    });
  }

  ngOnInit() {
    this.buildForm();
  }

}
