import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { NgModule } from '@angular/core';
import { FlashMessagesService } from 'ngx-flash-messages';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  currentUrl: string

  constructor(private router: Router, private appComponent: AppComponent, private flashMessagesService: FlashMessagesService) {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl)
    this.router = router;
    this.appComponent = appComponent
  }

  ngOnInit() {
    this.appComponent.resetResults()
    if(this.appComponent.getIsLoggedIn() == false){
      this.instructLogin();
      this.router.navigate(['/login']);
    }
  }

  instructLogin(){
      this.flashMessagesService.show('Not logged in. Please login to view content.', {
        classes: ['alert-info'],
        timeout: 4000, //default is 3000
      });
  }

}
