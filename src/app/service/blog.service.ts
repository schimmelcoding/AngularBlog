import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
//import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';
@Injectable()
export class BlogService {
  baseurl: string = 'http://blog.test/api';

  constructor(private http: Http) {

  }

  getUsernames(){
    // let usernames: string[];
    return this.http.get('http://blog.test/api/users/usernames')
        .map((resp: Response) => resp.json());
  }

  getLogin(username: string){
    let body = '{"username":"' + username + '"}';
    return this.http.post('http://blog.test/api/login', body)
        .map((resp: Response) => resp.json());
  }

}
