import { Component, OnInit, OnChanges} from '@angular/core';
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
  username: string;
  password: string;
  usernames: string[] = [];
  invalidLogin: boolean = false;
  invalidText: string = ''

  // these two are are for if the vaue is "" AFTER editing the first time.
  // leaving them undefined for that reason
  emptyUser: boolean;
  emptyPass: boolean;

  //details
  dbusername: string;
  dbpassword: string;
  dbrole: number;

  constructor(private blogservice: BlogService, public router: Router, public appComponent: AppComponent, private flashMessagesService: FlashMessagesService){
    this.blogservice = blogservice;
    this.router = router;
    this.appComponent = appComponent;
    this.flashMessagesService = flashMessagesService;
  }

  ngOnInit() {

  }

  userChange(newValue: string) {
    this.username = newValue;
    if (this.username == null || this.username == '') {
      this.emptyUser = true;
      document.getElementById('username').style.borderColor = "red";
    } else {
      this.emptyUser = false;
      document.getElementById('username').style.borderColor = "#7A8086";
    }
    console.log(this.username)
  }
  passChange(newValue) {
    this.password = newValue;
    if (this.password == null || this.password == '') {
      this.emptyPass = true;
      document.getElementById('password').style.borderColor = "red";
    } else {
      this.emptyPass = false;
      document.getElementById('password').style.borderColor = "#7A8086";
    }
    console.log(this.password)
  }

   closeNav() {
     this.appComponent.closeNav()
   }

   /* checking if they leave something empty
      if they leave more than one field empty, outline them red going from bottom up
      this will focus on the first element left blank in the form
   */
  checkCreds(){
    var valid = true;
    this.invalidLogin = false;

    if(this.password == "" || this.password == null){
      document.getElementById("password").focus();
      document.getElementById("password").style.borderColor = "red";
      console.log("enter pass");
      this.emptyPass = true;
      this.invalidLogin = true;
      valid = false;
      this.instructLogin('There was a problem signing in. Please check your username and password.');
    }
    if(this.username == "" || this.username == null){
      document.getElementById("username").focus();
      document.getElementById("username").style.borderColor ="red";
      console.log("enter user");
      this.emptyUser = true;
      valid = false;
      this.invalidLogin = true;
      this.instructLogin('There was a problem signing in. Please check your username and password.');
    }
    return valid;
  }

  //call service to login and stuff
  login(): void {
    //use the following to use actual login checks
    //uses service to connect to server and verify login
    if (this.appComponent.isLoggedIn == false) {
      //console.log(this.appComponent.isLoggedIn)
      if(this.checkCreds()){
        this.blogservice.getLogin(this.username, this.password).subscribe( data => {
          this.dbusername = data.username;
          this.dbpassword = data.password;
          this.dbrole = data.role_id;

          //if (this.dbusername != undefined $$)
          if (this.dbusername != undefined && this.dbusername != null) {
            console.log('Now logging in')
            console.log("logged in as: " + data.first_name + " " + data.last_name);
            this.appComponent.login();
            // TODO this.dbrole == 1 ? this.appComponent.isAdmin = true : this.appComponent.isAdmin = false;
            this.router.navigate(['/home']);
          } else {
            this.invalidLogin = true;
            this.username = '';
            this.password = '';
            this.instructLogin('There was a problem signing in. Please check your username and password.');
            document.getElementById('username').focus();
          }
        })
       }
     } //end real login

    //below temporarily ignores login to test pages
    // if (this.appComponent.isLoggedIn == false) {
    //   console.log(this.appComponent.isLoggedIn)
    //   if(this.checkCreds()){
    //     if (this.username == "gg"){
    //       this.invalidLogin = true;
    //       this.username = '';
    //       this.password = '';
    //       this.instructLogin('username or password incorrect. Please try again.');
    //       if(this.username == ''){
    //         document.getElementById('username').focus();
    //       }
    //       else if(this.password == ''){
    //         document.getElementById('password').focus();
    //       }
    //     } else {
    //       console.log("logging in");
    //       this.appComponent.login();
    //       console.log(this.appComponent.isLoggedIn)
    //       this.router.navigate(['/home'])
    //     }
    //   }
    // } //end fake login

} //end login function

  instructLogin(text: string){
    this.invalidText = text;
    console.log(text)
  }

  log(text:string){
    text.trim() != '' ? console.log(text): console.log("nothing") ;
  }
}
