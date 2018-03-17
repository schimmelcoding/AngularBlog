import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
//import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs';

@Injectable()
export class BlogService {
  baseurl: string = 'https://schimmelcoding.000webhostapp.com/api/public/api';
  //baseurl: string = 'https://www.schimmelcoding.com/api/public/api';

  constructor(private http: Http) {

  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  //specific service functions below this line


  //get a list of usernames from the db, #testing
  getUsernames(){
    var usernames: string[];
    return this.http.get(this.baseurl + '/users/usernames')
        .map((resp: Response) => resp.json());
  }

  //log in to the site with user and pass
  getLogin(username: string, password: string){
    let headers = new Headers();
    headers.append( "Content-Type", "application/json;charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
    //let body = '{"username":"' + username + '", "password":"' + password + '"}';
    let body = JSON.stringify({
      'username':username,
      'password':password
    });
    // alert(body);
    return this.http.post(this.baseurl + '/login', body, { headers : headers }) //body, options
      .map((resp: Response)=> resp.json())
      .catch(this.handleErrorObservable)/*resp.json()*/
  }

  //register new user
  registerUser(firstName: string, lastName : string, username: string, password: string, email: string){
    let headers = new Headers();
    headers.append( "Content-Type", "application/json;charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
    //let body = '{"username":"' + username + '", "password":"' + password + '"}';
    let body = JSON.stringify({
      'first_name': firstName,
      'last_name': lastName,
      'username': username,
      'password': password,
      'email': email,
    });
    // alert(body);
    return this.http.post(this.baseurl + '/register_user', body, { headers : headers }) //body, options
      .map((resp: Response) => resp.json())
      .catch(this.handleErrorObservable)/*resp.json()*/
  }

  //reset password (WIP)
  sendPassResetLink(email: string) {
    console.log(email);
    let headers = new Headers();
    headers.append( "Content-Type", "application/json;charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      'email': email.toLowerCase(),
    });
    return this.http.post(this.baseurl + '/pass_reset', body, { headers : headers }) //body, options
      .catch(this.handleErrorObservable)/*resp.json()*/
  }
}
