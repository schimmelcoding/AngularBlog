import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  currentUrl: string

  constructor(private router: Router, private appComponent: AppComponent) {
    this.router = router;
    this.appComponent = appComponent
  }

  ngOnInit() {
    if(this.appComponent.getIsLoggedIn()){
      this.currentUrl = this.router.url;
      console.log(this.currentUrl)
    }
  }

}
