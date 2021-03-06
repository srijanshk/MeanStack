import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ImportComponent } from './import/import.component';


const routes: Routes = [
  {
    path:'',
    redirectTo: 'manage',
    pathMatch: 'full'
  },
  {
    path: 'manage',
    component: ManageEmployeeComponent,
  },
  {
    path: 'add',
    component: AddEmployeeComponent,
  },
  {
    path: 'import',
    component: ImportComponent
  }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class EmployeeRoutingModule { }