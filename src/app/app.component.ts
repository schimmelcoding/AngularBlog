import { Component, OnInit, OnChanges, ElementRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BlogService } from './service/blog.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
        '(document:click)': 'handleClick($event)',
    },
})
export class AppComponent {
  testArray: string[] = new Array();
  searchWords: string[] = new Array();
  resultArray: Array<string> = new Array();
  emptyResults: boolean = false;
  isLoggedIn: boolean = false;
  isHomePage: boolean;
  searchString: string = '';
  routes: any[];
  @Output() public clickOutside = new EventEmitter<MouseEvent>();


  constructor(public router: Router, private elementRef: ElementRef, private flashMessagesService: FlashMessagesService) {
    this.flashMessagesService = flashMessagesService;
    this.elementRef = elementRef;
    this.router = router;
    //array of all the reachable places on the site, basically as OBJECTS with some extra crap, so cant be used directly for this purpose
    this.routes = this.router.config;
    // take only the path of each object, to create an array of actual useable routes
    for(var i = 0; i < this.routes.length; i++){
      this.testArray.push(this.routes[i].path);
    }
    console.log(this.testArray)
    //remove so you can't search for login
    this.testArray.splice(this.testArray.indexOf("login"),1)
    console.log(this.testArray)
  }

  ngOnInit(){
    // cool background is cool
    document.getElementsByTagName('body')[0].style.backgroundImage='url("../../../assets/Backgrounds/space-wallpapers-6.jpg")';
    if(this.getIsLoggedIn()){
      console.log(this.testArray);
    }
    this.router.navigate(['/login']);
  }

  flipLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  focusSearch(){
    document.getElementById('search').focus();
  }

  getIsLoggedIn(){
    if(this.isLoggedIn){return true;}
    else {
      return false;
    }
  }

/* sidenav specific methods */
//Set the width of the side navigation to 200px
 openNav() {
  document.getElementById("mySidenav").style.width = "200px";
 }
 //Set the width of the side navigation to 0
 closeNav() {
   document.getElementById("mySidenav").style.width = "0";
 }
 // if click outside of navbar, close it
 handleClick(event){
   var clickedComponent = event.target;
   var inside = false;
     do {
       //if they click on body of page
       if (clickedComponent === this.elementRef.nativeElement) {
         inside = true;
       }
         clickedComponent = clickedComponent.parentNode;
     } while (clickedComponent);
       if(!inside) {
         this.closeNav();
         this.resetResults();
      }
  }
  /* end of navbar specific functions */

  navigateToResult(event){
    console.log(event.target.innerText);
    this.resultArray = new Array();
    // this.flashMessagesService.show(event.target.innerText, {
    //     classes: ['alert-danger'],
    //     timeout: 4000, //default is 3000
    //   });
    if (event.target.innerText!="No results found."){
      if(this.testArray.indexOf(event.target.innerText) >-1){
        this.router.navigate(['/'+event.target.innerText]);
      }
    }
  }

  resetResults(){
    this.resultArray = new Array();
  }

  /*
    search all things in this.testArray. Can define testArray to be something else later,
      so we could use it for names of things or whatev.
   */
  search(){
    // dont do anything but clear past results if no string entered
    if(this.searchString == '' || !this.searchString.trim().length) {
      return;
    }

    // I'M A GOD FOR THIS, BTW
    // anyway, reset everything before search, basically
    this.resetResults();
    var numOfResults = 0;

    // just a temp array for proof of concept
    var tempArray: string[] = [ "me","me","me YOU", "YES", "PERHAPS", "this is a test string",
                                "slow algorithms", "efficient algorithms be damned", "youtube",
                                "angular2", "2+2", "green", "red", "YEEyee", "LOL", "SePpYDoNtBrEaKtHiSpLS",
                                "running out of phrases", "Java still better", "McGraw Hill Suxx"
                              ];
    // TODO: uncomment line below for actual use
     //tempArray = this.testArray;

    // start actual search --- a.k.a. the fun stuff
    this.searchString = this.searchString.trim();                       // First, remove leading/trailing "white space" from search string.
    this.searchWords = this.searchString.split(" ");                    // Take string we entered in search, and break it up.
    var upperArray = new Array();                                       // Next, we make an UPPERCASE COPY for both what we entered,for consistency,
    for(var i = 0; i < tempArray.length; i++){                          //     AND of what we're searching in, for consistency.
      if (tempArray[i].length){
        upperArray[i] = tempArray[i].toUpperCase();                     // We keep both in copy arrays to return original value later.
        upperArray[i].replace(/ /g,'');
      }
    }
    var upperCaseSearchWords = new Array();
    for(var i = 0; i < this.searchWords.length; i++){
      if (this.searchWords[i].length){
        upperCaseSearchWords[i] = this.searchWords[i].toUpperCase();
        upperCaseSearchWords[i] = upperCaseSearchWords[i].replace(/ /g,'');
      }
    }

    for (var i = 0; i < upperCaseSearchWords.length; i++){              // Then, for each word in the string we entered,
      for (var j = 0; j < upperArray.length; j++){                      //    look at each index in array we're searching in (e.g., names of articles).
        var wordsInString = upperArray[j].split(" ");                   // Break that index into array of words,
        for(var k = 0; k < wordsInString.length; k++){                  //    then for each word,
          if (wordsInString[k].indexOf(upperCaseSearchWords[i]) > -1) { //    if it contains the current "searchWord",
            if(!(this.resultArray.indexOf(tempArray[j]) >= 0)) {        //    and hasn't already been added to results
              this.resultArray.push(tempArray[j]);                      //    add it to our results,
              numOfResults++;                                           //    increase reult num, and continue
            }
          }
        }
      }
    }

    numOfResults ==  0 ? this.emptyResults = true : this.emptyResults = false;
    console.log("Results found: " + numOfResults);
    console.log("Search terms: " + this.searchString);
    console.log(this.resultArray);

    //not sure if should keep this or not
    // after searching, reset search bar
    //this.searchString = null;
    //document.getElementById('search').blur();
  }
  /* end of search function */

  /* TODO: implement some type of comparator when ready for it,
      perhaps by closest match or by date of article creation or w/e
  ß*/
  // sort(){
  //
  // }

}
