import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
//import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs';

@Injectable()
export class BlogService {
  baseurl: string = 'http://schimmelcoding.000webhostapp.com/api/public/api';
  //baseurl: string = 'https://www.schimmelcoding.com/api/public/api';

  constructor(private http: Http) {

  }

  getUsernames(){
    var usernames: string[];
    return this.http.get(this.baseurl + '/users/usernames')
        .map((resp: Response) => resp.json());
  }

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

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleErrorObservable (error: Response | any) {
  console.error(error.message || error);
  return Observable.throw(error.message || error);
  }


}
