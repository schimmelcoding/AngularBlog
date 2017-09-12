import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from './service/blog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Blog';
  username: string = "";
  password: string = "";
  usernames: string[] = [];
  constructor(private blogservice: BlogService){
    this.blogservice = blogservice;


    this.blogservice.getUsernames().subscribe(data => {
      console.log(data);
      for(let i=0; i < data.length; i++){
        this.usernames.push(data[i].username);
      }
    });

  }
  login(): void {
    let dbusername: string;
    let dbpassword: string;
    this.blogservice.getLogin(this.username).subscribe( data => {
      dbusername = data.username;
      dbpassword = data.password;
      alert(data);
      //alert(dbpassword);
    });
  }
}
