import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee-model';
import { NotificationService } from 'src/app/services/notification.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { ImportComponent } from '../import/import.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {

  public role: String;
  public usersource: any;
  dataSource = new MatTableDataSource();
  public displayedColums;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public datas: any;
  selection = new SelectionModel(true, []);
  selectedRows = [];
  data : any;
  renderedData: any;

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


  fetchEmployee() {
    this.service.getEmployees()
    .subscribe((data: Employee[])=> {
      this.usersource = new MatTableDataSource(data);
      this.dataSource = this.usersource;
      this.dataSource.connect().subscribe(d => this.renderedData = d);
      this.data = Object.assign(this.usersource);
      this.datas = this.usersource;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


 

  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        console.log(this.data);
  }

  selectRow(row) {
    console.log(row)
  }

  applyFilter(filterValue: String) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAdmin() {
    return this.role.toLowerCase() === 'admin';
  }

  isUser() {
    return this.role.toLowerCase() === 'user';

  }

  isAdminTable() {
    return this.displayedColums = ['select', 'sn', 'fullname', 'DOB', 'salary', 'gender', 'designation', 'created_at', 'details', 'update']
  }

  isUserTable() {
    return this.displayedColums = ['sn', 'fullname', 'DOB', 'salary', 'gender', 'designation', 'created_at']
  }

  onPaginateChange(event){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
 }

 onImport(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '60%';
  this.dialog.open(ImportComponent,dialogConfig)
  .afterClosed().subscribe(() => {
    this.fetchEmployee();
});
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

onView(id: string){
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
