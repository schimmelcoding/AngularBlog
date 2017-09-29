import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  confirmEmail: string = "";
  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  isInvalidFirst: boolean = false;
  isInvalidLast: boolean = false;
  isInvalidEmail: boolean = false;
  isInvalidConfirmEmail: boolean = false;
  isInvalidUser:boolean = false;
  isInvalidPass: boolean = false;
  isInvalidConfirmPass:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  validate(){
    var check: number = 0;
    if(this.confirmPassword == ""){
      document.getElementById("confirmPasswordInput").focus();
      document.getElementById("confirmPasswordInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("confirm pass");
      this.isInvalidConfirmPass = true;
      check++
    } else { document.getElementById("confirmPasswordInput").style.borderColor = "lightblue"; this.isInvalidConfirmPass = false}
    if(this.password == ""){
      document.getElementById("passwordInput").focus();
      document.getElementById("passwordInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("enter pass");
      this.isInvalidPass = true;
      check++;
    } else { document.getElementById("passwordInput").style.borderColor = "lightblue"; this.isInvalidPass = false}
    if(this.username == ""){
      document.getElementById("usernameInput").focus();
      document.getElementById("usernameInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("enter user");
      this.isInvalidUser = true;
      check++;
    } else { document.getElementById("usernameInput").style.borderColor = "lightblue"; this.isInvalidUser = false}
    if(this.confirmEmail == ""){
      document.getElementById("confirmEmailInput").focus();
      document.getElementById("confirmEmailInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("confirm mail");
      this.isInvalidConfirmEmail = true;
      check++;
    } else { document.getElementById("confirmEmailInput").style.borderColor = "lightblue"; this.isInvalidConfirmEmail = false}
    if(this.email == ""){
      document.getElementById("emailInput").focus();
      document.getElementById("emailInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("enter email");
      this.isInvalidEmail = true;
      check++;
    } else { document.getElementById("emailInput").style.borderColor = "lightblue"; this.isInvalidEmail = false}
    if(this.lastName == ""){
      document.getElementById("lastNameInput").focus();
      document.getElementById("lastNameInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("enter last name");
      this.isInvalidLast = true;
      check++
    } else { document.getElementById("lastNameInput").style.borderColor = "lightblue"; this.isInvalidLast = false}
    if(this.firstName == ""){
      document.getElementById("firstNameInput").focus();
      document.getElementById("firstNameInput").style.borderColor = "red";
      document.getElementById("confirmPasswordInput").style.borderWidth = "2px";
      console.log("enter first name");
      this.isInvalidFirst = true;
      check++
    } else { document.getElementById("firstNameInput").style.borderColor = "lightblue"; this.isInvalidFirst = false}
    if (check > 0)
      return;

    //check matching emails/passes
    else{
      this.isInvalidFirst = false;
      this.isInvalidLast = false;
      this.isInvalidEmail = false;
      this.isInvalidConfirmEmail = false;
      this.isInvalidUser = false;
      this.isInvalidPass = false;
      this.isInvalidConfirmPass = false;
      if(this.email != this.confirmEmail){
        alert("email no match");
        return;
      }
      if(this.password != this.confirmPassword){
        alert("password no match");
        return;
      }
    }
    //registerfunction, redirect back to login
    this.clearFields();
    document.getElementById("firstNameInput").focus();
  }

  clearFields(){
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.confirmEmail = "";
    this.username = "";
    this.password = "";
    this.confirmPassword = "";
  }

  tabToTop(){
    document.getElementById("firstNameInput").focus()
  }

}
