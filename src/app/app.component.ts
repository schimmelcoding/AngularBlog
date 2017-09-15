import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
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

  isLoggedIn : boolean = false;
  @Output() public clickOutside = new EventEmitter<MouseEvent>();

  constructor(public router: Router, private _elementRef: ElementRef) {
    this.router = router;
  }

  OnInit(){
  }

  flipLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  getIsLoggedIn(){
    if (this.isLoggedIn == true) { return true; }
    this.router.navigate(['/login']);
    return false;
  }

  getIsHomePage() {
    //regex to test if we are on root page. checking against index.html
    var is_root =/^\/(?:|index\.aspx?)$/i.test(location.pathname);
    return is_root;
  }

  hello(){alert("hello")}

  /* Set the width of the side navigation to 250px */
 openNav() {
    document.getElementById("mySidenav").style.width = "16%";
 }

 /* Set the width of the side navigation to 0 */
 closeNav() {
   document.getElementById("mySidenav").style.width = "0";
 }
}
