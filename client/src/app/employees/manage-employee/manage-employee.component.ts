import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee-model';
import { NotificationService } from 'src/app/services/notification.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {

  public role: String;
  public usersource: any;
  public displayedColums;
  public pageSize: number = 10;
  public pageIndex: number = 0;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private service: EmployeeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.role = currentUser.role;
    this.fetchEmployee();
  }


  fetchEmployee(){
    this.service.getEmployees()
    .subscribe((data: Employee[])=> {
      this.usersource = new MatTableDataSource(data);
      this.usersource.paginator = this.paginator;
      this.usersource.sort = this.sort;
    })
  }

  applyFilter(filterValue: String) {
    this.usersource.filter = filterValue.trim().toLowerCase();

    if (this.usersource.paginator) {
      this.usersource.paginator.firstPage();
    }
  }

  isAdmin() {
    return this.role.toLowerCase() === 'admin';
  }

  isUser() {
    return this.role.toLowerCase() === 'user';

  }

  isAdminTable() {
    return this.displayedColums = ['checked', 'sn', 'fullname', 'DOB', 'salary', 'gender', 'designation', 'created_at', 'details', 'update']
  }

  isUserTable() {
    return this.displayedColums = ['sn', 'fullname', 'DOB', 'salary', 'gender', 'designation', 'created_at']
  }

  onPaginateChange(event){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
 }

 public redirectToDetails = (_id: string) => {
}

public redirectToUpdate = (_id: string) => {
}

onCreate(){
  this.service.initializeFormGroup();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '60%';
  this.dialog.open(AddEmployeeComponent,dialogConfig)
  .afterClosed().subscribe(() => {
      this.fetchEmployee();
  });
}

onEdit(id: string){
  this.service.populateForm(id);
    const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "60%";
  this.dialog.open(AddEmployeeComponent,dialogConfig)
  .afterClosed().subscribe(() => {
    this.fetchEmployee();
});


}
}
