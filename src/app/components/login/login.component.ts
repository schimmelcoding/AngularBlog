import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from '../../service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private blogservice: BlogService, public router: Router){
    this.blogservice = blogservice;
    this.router = router;

    this.blogservice.getUsernames().subscribe(data => {
      console.log(data);
      // for(let i=0; i < data.length; i++){
      //   this.usernames.push(data[i].username);
      // }
    });

  }

  ngOnInit() {
  }

  url: string;
  title = 'Blog';
  username: string = "";
  password: string = "";
  usernames: string[] = [];

  login(): void {

    alert("user: "+ this.username +", pass: " + this.password);
    this.blogservice.getLogin(this.username, this.password).subscribe( data => {
      console.log(JSON.stringify(data));
      // if (data.role_id == 1) {
      //   this.router.navigateByUrl('/admin-page');
      // } else {
      //   alert("woah");
      // }
      //alert("user is " + dbusername + " password is " + dbpassword);
      //alert("user: " + dbusername + " pass: " + dbpassword);

    });
  }

}
