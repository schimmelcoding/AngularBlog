import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  constructor(private router: Router, private appComponent: AppComponent) {
    this.router = router;
    this.appComponent = appComponent
  }

  ngOnInit() {
    this.appComponent.getIsLoggedIn();
  }

}
