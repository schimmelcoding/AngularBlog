import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'app-lost-pass',
  templateUrl: './lost-pass.component.html',
  styleUrls: ['./lost-pass.component.css']
})
export class LostPassComponent implements OnInit {

  email: string = "";
  instructionText: string = "Enter email address to send reset email.";

  constructor(private blogservice: BlogService, public router: Router, public appComponent: AppComponent, private flashMessagesService: FlashMessagesService
){
    this.blogservice = blogservice;
    this.router = router;
    this.appComponent = appComponent;
  }

  ngOnInit() {
  }

  sendResetLink(){
    if(this.email == null || this.email == undefined) {
      console.log("Address is null");
    }
    else {
      this.blogservice.sendPassResetLink(this.email).subscribe(data => {
        console.log("Email sent");
        this.instructionText = "Email has been sent.";
        this.flashMessagesService.show('Email has been sent to ' + this.email, {
          classes: ['alert-info'],
          timeout: 3000, //default is 3000
        });
        this.router.navigate(['/login'])
      });
    }
  }


}
