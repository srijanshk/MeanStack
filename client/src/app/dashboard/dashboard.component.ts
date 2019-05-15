import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public role: String;

  constructor(
    private router: Router,
    private authservice: AuthenticationService
  ) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.role = currentUser.role;
  }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

  isAdmin() {
    return this.role.toLowerCase() === 'admin';
  }

  isUser() {
    return this.role.toLowerCase() === 'user';
  }

}
