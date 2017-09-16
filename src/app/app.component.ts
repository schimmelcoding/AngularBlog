import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from './service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLoggedIn: boolean = false;
  isHomePage: boolean;
  @Output() public clickOutside = new EventEmitter<MouseEvent>();

  constructor(public router: Router, private _elementRef: ElementRef) {
    this.router = router;
  }

  ngOnInit(){
    document.getElementsByTagName('body')[0].style.backgroundImage='url("../../../assets/Backgrounds/space-wallpapers-6.jpg")';
  }

  flipLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  getIsLoggedIn(){
    if (this.isLoggedIn == true) { return true; }
    else {
      this.router.navigate(['/login']);
      return false;}
  }

  /* Set the width of the side navigation to 250px */
 openNav() {
  document.getElementById("mySidenav").style.width = "16%";
 }

 /* Set the width of the side navigation to 0 */
 closeNav() {
   document.getElementById("mySidenav").style.width = "0";
 }

}
