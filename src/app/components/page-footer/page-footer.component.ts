import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.css']
})
export class PageFooterComponent implements OnInit {

  constructor(public router: Router) {this.router = router;}

  ngOnInit() {
  }

  testLocation() {
    if (this.router.url == "/") {
      return true;
    }
    else return false;
  }

}
