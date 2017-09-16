import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from '../../service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  currentUrl: string
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
    this.appComponent.getIsLoggedIn();
    this.currentUrl = this.router.url;
    console.log(this.currentUrl)
    this.getUsernames()
  }

  getUsernames() {
    this.blogservice.getUsernames().subscribe(data => {
      console.log(data);
      for(let i=0; i < data.length; i++){
        this.usernames.push(data[i].username);
      }
    });
  }

  login(): void {
    var dbusername: string;
    var dbpassword: string;
    var dbrole: number;

    //use the following to use actual login checks
    /*this.blogservice.getLogin(this.username, this.password).subscribe( data => {
      dbusername = data.username;
      dbpassword = data.password;
      dbrole = data.role_id;

      console.log("logged in as: ", JSON.stringify(data))
      if (this.appComponent.isLoggedIn == false) {
        console.log('Now logging in')
        if (data.role_id == 1) {
          this.router.navigate(['/admin-page']);
          this.appComponent.flipLogin();
        } else {
          this.router.navigate(['/']);
          this.appComponent.flipLogin();
        }
      }
    });*/

    // below temporarily ignores login to test pages
    if (this.appComponent.isLoggedIn == false) {
      console.log("logging in")
      this.appComponent.flipLogin()
      this.router.navigate(['/admin-page'])
    } else {
      console.log('User already logged in. Logout to sign in as another user.')
    }
  }

}
