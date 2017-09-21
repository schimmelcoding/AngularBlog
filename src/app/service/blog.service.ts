import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
//import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';
@Injectable()
export class BlogService {
  baseurl: string = 'https://www.schimmelcoding.com/api/public/api';

  constructor(private http: Http) {

  }

  getUsernames(){
    // let usernames: string[];
    return this.http.get(this.baseurl + '/users/usernames')
        .map((resp: Response) => resp.json());
  }

  getLogin(username: string, password: string){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = '{"username":"' + username + '", "password":"' + password + '"}';
    //alert(body)
    return this.http.post(this.baseurl + '/login', body) //body, options
      .map((resp: Response) => alert(resp.json))/*resp.json()*/
    }
}
