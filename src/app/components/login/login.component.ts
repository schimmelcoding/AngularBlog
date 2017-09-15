import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from '../../service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  url: string;
  title = 'Schimmel Coding Blog';
  username: string = "";
  password: string = "";
  usernames: string[] = [];

  constructor(private blogservice: BlogService, public router: Router, public appComponent: AppComponent){
    this.blogservice = blogservice;
    this.router = router;
    this.appComponent = appComponent;
  }

  ngOnInit() {
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
    this.blogservice.getLogin(this.username, this.password).subscribe( data => {
      dbusername = data.username;
      dbpassword = data.password;
      if (this.appComponent.isLoggedIn == false) {
        console.log('Now logging in')
        if (data.role_id == 1) {
          this.router.navigate(['/admin-page']);
          this.appComponent.flipLogin();
        } else {
          this.router.navigate(['/']);
          this.appComponent.flipLogin();
        }
      } else {
        alert('User already logged in. Logout to sign in as another user.')
      }
    });
  }

}
