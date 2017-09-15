import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  // calendar stuff
  date: Date = new Date();
  day: number;
  month: number;
  updatedMonth:number;
  year: number;
  monthLength:number;
  months: string[];
  startDate: Date; 
  startDay: number;
  formatedDate: string;

  constructor() { 
    // calander stuff
    this.date = new Date();
    this.day = this.date.getDate();
    this.month = this.date.getMonth();
    this.updatedMonth = this.month + 1;
    this.year = this.date.getFullYear();
    this.monthLength = this.daysInMonth(this.month, this.year);
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.startDate = new Date(this.year, this.month, 1);
    this.startDay = this.startDate.getDay();
    this.formatedDate = this.updatedMonth + "/" + this.day + "/" + this.year;
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.showCalendar();
  }

  daysInMonth(month, year) {
      // function to return the days in a month.
      return new Date(year, month + 1, 0).getDate();
  }

  showCalendar(){
    for (var i = 0; i < this.startDay; i++){
      document.write("<td></td>");
    }
    for (var i = 1; i <= this.monthLength; i++){
      if( i == this.day) {
        document.write("<td id='day" + i + "' class='current'>"+ i + "</td>");
      }
      else {
        document.write("<td id='day"+i+"'>" +i+ "</td>");
      }
      if((i + this.startDay) % 7 == 0){
        document.write("</tr><tr>");
      }
    }
    if ((this.monthLength + this.startDay) % 7 != 0){
      for (i=0; ((i + this.startDay + this.monthLength) % 7) > 0; i++){
        document.write("<td></td>");
      }
      
    }
  }
}
