import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

public Url: string = environment.userUrl;

  constructor(private http: HttpClient) { }


login(username: string, password: string) {
  return this.http.post<any>(`${this.Url}/auth/login`, JSON.stringify({'username': username, 'password': password}), this.generateHeaders())
  .pipe(map(user => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user.user));
    }
    return user;
  }));
}

logout() {
  localStorage.removeItem('currentUser');
}

private generateHeaders() {
  return {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
}
}
