import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from './service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoginVisible: boolean = true;

  constructor(public router: Router) {
    this.router = router;
  }

  OnInit(){
    if(this.isLoginVisible){
      this.router.navigateByUrl('/');
    }
  }

  flipLoginButton() {
    if(this.isLoginVisible == true) {
      this.isLoginVisible = false;
    } else {
      this.isLoginVisible = true;
    }
  }

}
