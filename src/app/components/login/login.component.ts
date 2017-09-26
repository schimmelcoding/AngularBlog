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
  invalidText: string = ''

  //details
  dbusername: string;
  dbpassword: string;
  dbrole: number;

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

   /* checking if they leave something empty
      if they leave more than one field empty, outline them red going from bottom up
      this was the focus is put on first element left blank in the form
   */
  checkCreds(){
    var valid = true;
    this.invalidLogin = false;
    this.emptyUser = false;
    this.emptyPass = false;

    if(this.password == ""){
      document.getElementById("password").focus();
      console.log("enter pass");
      this.emptyPass = true;
      this.invalidLogin = true;
      valid = false;
    }
    if(this.username == ""){
      document.getElementById("username").focus();
      console.log("enter user");
      this.emptyUser = true;
      valid = false;
      this.invalidLogin = true;
    }
    return valid;
  }

  //call service to login and stuff
  login(): void {

    //use the following to use actual login checks
    //uses service to connect to server and verify login
    if (this.appComponent.isLoggedIn == false) {
      console.log(this.appComponent.isLoggedIn)
      if(this.checkCreds()){
        this.blogservice.getLogin(this.username, this.password).subscribe( data => {
          this.dbusername = data.username;
          this.dbpassword = data.password;
          this.dbrole = data.role_id;

          console.log('Now logging in')
          if (this.appComponent.isLoggedIn == false) {
            console.log("logged in as: " + data.first_name + " " + data.last_name);
            this.appComponent.login();
            //this.dbrole == 1 ? this.appComponent.isAdmin = true : this.appComponent.isAdmin = false;
            this.router.navigate(['/home']);
          } else {
            this.invalidLogin = true;
            this.username = '';
            this.password = '';
            this.instructLogin('Username or password incorrect. Please try again.');
            document.getElementById('username').focus();
           }
        })
       }
     }
    // }


    //below temporarily ignores login to test pages
  //   if (this.appComponent.isLoggedIn == false) {
  //     console.log(this.appComponent.isLoggedIn)
  //     if(this.checkCreds()){
  //       if (this.username == "gg"){
  //         this.invalidLogin = true;
  //         this.username = '';
  //         this.password = '';
  //         this.instructLogin('Username or password incorrect. Please try again.');
  //         if(this.username == ''){
  //           document.getElementById('username').focus();
  //         }
  //         else if(this.password == ''){
  //           document.getElementById('password').focus();
  //         }
  //       } else {
  //         console.log("logging in");
  //         this.appComponent.logout();
  //         console.log(this.appComponent.isLoggedIn)
  //         this.router.navigate(['/home'])
  //       }
  //     }
  //   }

}

  instructLogin(text: string){
    this.invalidText = text;
    console.log(text)
  }

  log(text:string){
    text.trim() != '' ? console.log(text): console.log("nothing") ;
  }
}
