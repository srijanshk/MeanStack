import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../core/material/material.module';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AuthenticationService } from '../services/authentication.service';
import { JwtInterceptor, ErrorInterceptor } from '../helpers';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { EmployeeService } from '../services/employee.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ImportComponent } from './import/import.component';

@NgModule({
  declarations: [ManageEmployeeComponent, AddEmployeeComponent, ImportComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModule,
    EmployeeRoutingModule
  ],
  providers: [
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    EmployeeService
  ]
})
export class EmployeesModule { }
