import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee-model';
import { NotificationService } from '../../services/notification.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { ImportComponent } from '../import/import.component';
import { SelectionModel } from '@angular/cdk/collections';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../services/excel.service';


@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {

  public role: String;
  public usersource: any;
  dataSource = new MatTableDataSource<Employee>();
  public displayedColums;
  public pageSize = 10;
  public pageIndex = 0;
  selection = new SelectionModel<Employee>(true, []);
  selectedRows = [];
  selected = [];
  isButtonEnable = true;
  private mode = "create";



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private service: EmployeeService,
    private notificationService: NotificationService,
    private excelService: ExcelService
  ) {
    this.selection.changed.subscribe(item => {
      this.isButtonEnable = this.selection.selected.length === 0;
    });

  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.role = currentUser.role;
    this.fetchEmployee();
  }


  fetchEmployee() {
    this.service.getEmployees()
      .subscribe((data: Employee[]) => {
        this.usersource = new MatTableDataSource<Employee>(data);
        this.dataSource = this.usersource;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onExportExcel() {
    var data = [];
    this.selection.selected.forEach(item => {
      const index: number = this.dataSource.data.findIndex(d => d === item);
      this.selected.push(this.dataSource.data[index]);
    });
    this.selected.forEach(d => {
      var temp = [d.fullname, d.DOB, d.gender, d.salary, d.designation];
      data.push(temp);
    });
    this.excelService.exportAsExcelFile(data, 'employee')
    this.selection.clear();

  }

  onExportPdf() {
    var doc = new jsPDF();
    var rows = [];


    this.selection.selected.forEach(item => {
      const index: number = this.dataSource.data.findIndex(d => d === item);
      this.selectedRows.push(this.dataSource.data[index]);
    });
    this.selectedRows.forEach(d => {
      var temp = [d.fullname, d.DOB, d.gender, d.salary, d.designation];
      rows.push(temp);

    });
    doc.autoTable({
      head: [['fullname', 'Date of Birth', 'Gender', 'Salary', 'Designation']],
      body: rows
    });
    doc.save('test.pdf');
    this.selection.clear();

  }


  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.isButtonEnable = true;
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.isButtonEnable = false;
    }
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
    return this.displayedColums = ['select', 'sn', 'fullname', 'DOB', 'salary', 'gender', 'designation', 'created_at', 'details', 'update'];
  }

  isUserTable() {
    return this.displayedColums = ['sn', 'fullname', 'DOB', 'salary', 'gender', 'designation', 'created_at'];
  }

  onPaginateChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onImport() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(ImportComponent, dialogConfig)
      .afterClosed().subscribe(() => {
        this.fetchEmployee();
    });
  }

  onCreate(mode) {
    this.service.initializeFormGroup();
    mode = 'onAdd';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = mode;
    this.dialog.open(AddEmployeeComponent, dialogConfig)
      .afterClosed().subscribe(() => {
        this.fetchEmployee();
      });
  }

  onEdit(id: string, mode) {
    this.service.populateForm(id);
    mode = 'onedit';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = mode;
    this.dialog.open(AddEmployeeComponent, dialogConfig)
      .afterClosed().subscribe(() => {
        this.fetchEmployee();
        this.selection.clear();
      });


  }

  onView(id: string, mode) {
    this.service.populateForm(id);
    mode = 'onview';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = mode;
    this.dialog.open(AddEmployeeComponent, dialogConfig)
      .afterClosed().subscribe(() => {
        this.fetchEmployee();
        this.selection.clear();

      });


  }
}
const ELEMENT_DATA: Employee[] = [];
