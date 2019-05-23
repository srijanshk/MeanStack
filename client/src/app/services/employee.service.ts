import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee-model';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  public Url: string = environment.userUrl;


  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    fullname: new FormControl(''),
    DOB: new FormControl(''),
    gender: new FormControl(''),
    salary: new FormControl(''),
    designation: new FormControl(''),
    profilePicture: new FormControl(''),
    created_at: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      fullname: '',
      DOB: '',
      gender: '',
      salary: '',
      designation: '',
      profilePicture: null,
      created_at: null,
    });
  }

  constructor(private http: HttpClient) { }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }



  getEmployees() {
    return this.http.get(`${this.Url}/employee/`);
  }
  getEmployee(userId) {
    return this.http.get(`${this.Url}/employee/${userId}`);
  }

  ImportEmployee(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    console.log(formData)

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(`${this.Url}/employee/import`, formData, httpOptions);
  }

  AddNewEmployee(data) {
    return this.http.post(`${this.Url}/employee/`, data);
  }

  EditEmployee(userId, data) {
    return this.http.put(`${this.Url}/employee/${userId}`, data);
  }

  populateForm(employee) {
    this.form.setValue(_.omit(employee, ''));
  }
}
