import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from '../../service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { FlashMessagesService } from 'ngx-flash-messages';
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
  username: string = '';
  password: string = '';
  emptyUser: boolean = false;
  emptyPass: boolean = false;
  usernames: string[] = [];
  invalidLogin: boolean = false;

  constructor(private blogservice: BlogService, public router: Router, public appComponent: AppComponent, private flashMessagesService: FlashMessagesService){
    this.blogservice = blogservice;
    this.router = router;
    this.appComponent = appComponent;
  }

  ngOnInit() {
    this.appComponent.resetResults()
    if(this.appComponent.getIsLoggedIn() == false){
      //this.instructLogin('Not logged in. Please login to view content.');
      this.appComponent.resetResults()
      this.currentUrl = this.router.url;
      console.log(this.currentUrl);
      document.getElementById('username').focus();
    }
  }
   closeNav() {
     this.appComponent.closeNav()
   }

  //checking if they leave something empty
  checkCreds(){
    var valid = true;
    this.invalidLogin = false;
    this.emptyUser = false;
    this.emptyPass = false;

    if(this.password == ""){
      document.getElementById("password").focus();
      console.log("enter pass");
      this.emptyPass = true;
      valid = false;
    }
    if(this.username == ""){
      document.getElementById("username").focus();
      console.log("enter user");
      this.emptyUser = true;
      valid = false;
    }
    return valid;
  }

  //call service to login and stuff
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
          this.router.navigate(['/landing-page']);
          this.appComponent.flipLogin();
        }
      }
    });*/

    // below temporarily ignores login to test pages
    if (this.appComponent.isLoggedIn == false) {
      console.log(this.appComponent.isLoggedIn)
      if(this.checkCreds()){
        if (this.username == "gg"){
          this.invalidLogin = true;
          this.username = null;
          this.password = null;
          this.instructLogin('Username or password incorrect. Please try again.');
          if(this.username == null){
            document.getElementById('username').focus();
          }
          else if(this.password == null){
            document.getElementById('password').focus();
          }
        } else {
          console.log("logging in");
          this.appComponent.flipLogin();
          console.log(this.appComponent.isLoggedIn)
          this.router.navigate(['/home'])
        }
      }
    }
  }

  //display red flash message for 100 seconds at incorrect login
  instructLogin(text: string){
    // this.flashMessagesService.show(text, {
    //     classes: ['alert-danger'],
    //     timeout: 60000, //default is 3000
    //   });
      document.getElementById('invalid-text').innerText = text;
    }

}
