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
//import { TrieSearch } from '../../node_modules/trie-search';
// import { TrieNode } from './model/trie';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
        '(document:click)': 'handleClick($event)',
    },
})
export class AppComponent {
  //static root: TrieNode = new TrieNode();
  testArray: string[] = new Array();
  searchWords: string[] = new Array();
  resultArray: Array<string> = new Array();
  history:Array<string> = new Array();
  emptyResults: boolean = false;
  isLoggedIn: boolean = false;
  isHomePage: boolean;
  searchString: string = '';
  routes: any[];
  @Output() public clickOutside = new EventEmitter<MouseEvent>();

  //TODO replace later
  arr = new Array();
  TrieSearch = require('trie-search');
  ts = new this.TrieSearch('name', {
    min: 1,
    splitOnRegEx: /\s/g // /\s/g is default regular expression to split all keys into tokens. By default this is any whitespace. Set to 'false' if you have whitespace in your keys!
  });

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

    this.arr = this.createSearchableArray();
  }

  ngOnInit(){
    this.createTrie()
    this.loadBrowserSpecificCSS();
    // cool background is cool
    document.getElementsByTagName('body')[0].style.backgroundImage='url("../../../assets/Backgrounds/space-wallpapers-6.jpg")';
    if(this.getIsLoggedIn()){
      console.log(this.testArray);
    }
    this.router.navigate(['/login']);
  }
  //separating this in case the future calls for it
  loadBrowserSpecificCSS(){var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent .indexOf('safari')!=-1){
      if(userAgent .indexOf('chrome')  > -1){
        document.getElementById('resultsBox').style.left = "273px";
      }else{
        //browser is safari, add css
        document.getElementById('resultsBox').style.left = "276px";
      }
    }
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
         //this.resetResults();
      }
  }
  /* end of navbar specific functions */

  navigateToResult(location: string){
    console.log(location);
    this.resetResults();
    this.searchString = '';

    if (location != "No results found."){
      if(this.testArray.indexOf(location) >= 0){
        this.router.navigate(['/'+location]);
      }
    }
    this.addToHistory(location);
  }

  // this is exlusively for readability issues later
  resetSearchString(){
    this.searchString = '';
    document.getElementById('search').blur()
  }

  resetResults(){
    this.resultArray = new Array();
    document.getElementById('resultsBox').style.visibility = "hidden"
  }

  /*
    search all things in this.testArray. Can define testArray to be something else later,
      so we could use it for names of things or whatev.
   */
  // search(){
  //   // dont do anything but clear past results if no string entered
  //   if(this.searchString == '' || !this.searchString.trim().length) {
  //     this.resetResults()
  //     return;
  //   }
  //
  //   // I'M A GOD FOR THIS, BTW
  //   // anyway, reset everything before search, basically
  //   this.resetResults();
  //   var numOfResults = 0;
  //
  //   // just a temp array for proof of concept
  //   var tempArray: string[] = [ "me","me","me YOU","you ME","YES","PERHAPS","this is a test string",
  //                               "slow algorithms","efficient algorithms be damned","youtube",
  //                               "angular2","2 + 2 = fish","green","red","YEEyee","LOL","SePpYDoNtBrEaKtHiSpLS",
  //                               "running out of phrases","Java still better","McGraw Hill Suxx","st    upid     us    Er"
  //                             ];
  //   // this loop will see only if EXACT match. if exact match, don't do keyword search
  //   for (var i = 0; i < tempArray.length; i++) {
  //     if (tempArray[i].toUpperCase() == this.searchString.toUpperCase()){
  //       if (!(this.resultArray.indexOf(tempArray[i]) >= 0)){
  //         this.resultArray.push(tempArray[i]);
  //         numOfResults++;
  //       }
  //     }
  //   }
  //   // TODO: uncomment line below for actual use
  //    //tempArray = this.testArray;
  //
  //   // start actual search --- a.k.a. the fun stuff
  //   if (numOfResults == 0){
  //     this.searchString = this.searchString.trim();                       // First, remove leading/trailing "white space" from search string.
  //     this.searchWords = this.searchString.split(" ");                    // Take string we entered in search, and break it up.
  //     var upperArray = new Array();                                       // Next, we make an UPPERCASE COPY for both what we entered,for consistency,
  //     for(var i = 0; i < tempArray.length; i++){                          //     AND of what we're searching in, for consistency.
  //       if (tempArray[i].length){
  //         upperArray[i] = tempArray[i].toUpperCase();                     // We keep both in copy arrays to return original value later.
  //         upperArray[i].replace(/ /g,'');
  //       }
  //     }
  //     var upperCaseSearchWords = new Array();
  //     for(var i = 0; i < this.searchWords.length; i++){
  //       if (this.searchWords[i].length){
  //         upperCaseSearchWords[i] = this.searchWords[i].toUpperCase();
  //         upperCaseSearchWords[i] = upperCaseSearchWords[i].replace(/ /g,'');
  //       }
  //     }
  //
  //     for (var i = 0; i < upperCaseSearchWords.length; i++){              // Then, for each word in the string we entered,
  //       for (var j = 0; j < upperArray.length; j++){                      //    look at each index in array we're searching in (e.g., names of articles).
  //         var wordsInString = upperArray[j].split(" ");                   // Break that index into array of words,
  //         for(var k = 0; k < wordsInString.length; k++){                  //    then for each word,
  //           if (wordsInString[k].indexOf(upperCaseSearchWords[i]) > -1) { //    if it contains the current "searchWord",
  //             if(!(this.resultArray.indexOf(tempArray[j]) >= 0)) {        //    and hasn't already been added to results
  //               this.resultArray.push(tempArray[j]);                      //    add it to our results,
  //               numOfResults++;                                           //    increase reult num, and continue
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   numOfResults ==  0 ? this.emptyResults = true : this.emptyResults = false;
  //   console.log("Results found: " + numOfResults);
  //   console.log("Search terms: " + this.searchString);
  //   console.log(this.resultArray);
  //
  //   //not sure if should keep this or not
  //   // after searching, reset search bar
  //   //this.searchString = null;
  //   //document.getElementById('search').blur();
  // }
  /* end of search function */

  /* TODO: implement some type of comparator when ready for it,
      perhaps by closest match or by date of article creation or w/e
  ß*/
  // sort(){
  //
  // }

  //creates a radial tree of things in the array, based on the alphabet
  //(ex: "m" will have children "me" and "me ".
  //     "me " will have child "me y", etc.)
  tree(){
    //clear previous results before search
    console.clear();
    this.resetResults();

    /*
     TODO current seach method is akin to autocomplete (matching starting at first matching word.
     Maybe change this to look at each search work for keyword serch
    */
    // get search results
    var res = this.ts.get(this.searchString);
    var numOfResults: number = 0;
    //should limit to showing first 4 results
    for(var i = 0; i < res.length; i++){
      if(!(this.resultArray.indexOf(res[i].name) >= 0)) {
        console.log(res[i].name);
        this.resultArray.push(res[i].name);
        numOfResults++;
      }
      if (numOfResults == 4)
         break;
    }
    // show results box element, a.k.a., autocomplete suggestions

      if (this.resultArray.length < 1 && this.history.length < 1 && this.searchString.trim() == ''){
          document.getElementById('resultsBox').style.visibility = "hidden";
      }
      else {
        document.getElementById('resultsBox').style.height = "auto";
        document.getElementById('resultsBox').style.width = "260px";
        document.getElementById('resultsBox').style.visibility = "visible";
      }
  }

  addToHistory(item: string){
    if(!(this.history.indexOf(item) >= 0)){
      this.history.splice(0,0,item);
      console.log(item + " added to history");
    }
  }
  retrieveSearchHistory(){
    return this.history;
  }
  removeItemFromHistory(item: string){
    var tempArr = [];

    for (var i = 0; i < this.history.length; i++) {
      if (this.history[i] == item){
        console.log(item + " matches history " + this.history[i])
        this.history.splice(i,1);
      } else {
        console.log("nope")
      }
    }

  }

  underlineResult(item: string, group?: number){
    var block: number;
    group == null? block = 1 : block = group;
    if (block == 1)
      document.getElementById("resultItem"+item).style.textDecoration = "underline";
    else
      document.getElementById("resultItem"+item+""+block).style.textDecoration = "underline";
  }
  removeUnderlineFromResult(item: string, group?: number){
    var block: number;
    group == null? block = 1 : block = group;
    if (block == 1)
      document.getElementById("resultItem"+item).style.textDecoration = "none";
    else
      document.getElementById("resultItem"+item+""+block).style.textDecoration = "none";
  }

  createTrie(){
    //create the tree from an array, TODO move to separate method
    this.ts.addAll(this.arr);
  }
  createSearchableArray(){
    var arr = [
                {name: "me"},
                {name: "me"},
                {name: "me"},
                {name: "me"},
                {name: "me YOU"},
                {name: "you ME"},
                {name: "hE"},
                {name: "sHe"},
                {name: "w3"},
                {name: "WOMBO"},
                {name: "YES"},
                {name: "PERHAPS"},
                {name: "this is a test string"},
                {name: "slow algorithms"},
                {name: "efficient algorithms be damned"},
                {name: "youtube"},
                {name: "an"},
                {name: "ang"},
                {name: "angu"},
                {name: "angul"},
                {name: "angula"},
                {name: "angular"},
                {name: "angular2"},
                {name: "2 + 2 = fish"},
                {name: "green"},
                {name: "red"},
                {name: "YEEyee"},
                {name: "LOL"},
                {name: "SePpYDoNtBrEaKtHiSpLS"},
                {name: "running out of phrases"},
                {name: "Java still better"},
                {name: "McGraw Hill Suxx"},
                {name: "st    upid     us    Er"},
                {name: "a"},
                {name: "aa"},{name: "aah"},{name: "aahed"},{name: "aahing"},{name: "aahs"},{name: "aal"},{name: "aalii"},{name: "aaliis"},{name: "aals"},{name: "aardvark"},{name: "aardvarks"},{name: "aardwolf"},{name: "aardwolves"},{name: "aargh"},{name: "aarrgh"},{name: "aarrghh"},{name: "aarti"},{name: "aartis"},{name: "aas"},{name: "aasvogel"},{name: "aasvogels"},{name: "ab"},{name: "aba"},
                {name: "abac"},
                {name:"abaca"},
                {name: "abacas"},
                {name: "abaci"},{name: "aback"},{name: "abacs"},{name: "abacterial"},{name: "abactinal"},{name: "abactinally"},{name: "abactor"},{name: "abactors"},{name: "abacus"},{name: "abacuses"},{name: "abaft"},
                {name: "abaka"},{name: "abakas"},{name: "abalone"},{name: "abalones"},{name: "abamp"},{name: "abampere"},{name: "abamperes"},{name: "abamps"},{name: "aband"},{name: "abanded"},{name: "abanding"},
                {name: "abandon"},{name: "abandoned"},{name: "abandonedly"},{name: "abandonee"},
                {name: "abandonees"},{name: "abandoner"},{name: "abandoners"},{name: "abandoning"},{name: "abandonment"},{name: "abandonments"},{name: "abandons"},{name: "abandonware"},{name: "abandonwares"},{name: "abands"},
                {name: "abapical"},{name: "abas"},{name: "abase"},{name: "abased"},{name: "abasedly"},{name: "abasement"},{name: "abasements"},{name: "abaser"},{name: "abasers"},{name: "abases"},{name: "abash"},
                {name: "abashed"},{name: "abashedly"},{name: "abashes"},
                {name: "abashing"},{name: "abashless"},{name: "abashment"},{name: "abashments"},{name: "abasia"},{name: "abasias"},{name: "abasing"},{name: "abask"},{name: "abatable"},{name: "abate"},{name: "abated"},
                {name: "abatement"},{name: "abatements"},{name: "abater"},{name: "abaters"},{name: "abates"},{name: "abating"},{name: "abatis"},{name: "abatises"},{name: "abator"},{name: "abators"},{name: "abattis"},
                {name: "abattises"},{name: "abattoir"},{name: "abattoirs"},{name: "abattu"},
                {name: "abature"},{name: "abatures"},{name: "abaxial"},{name: "abaxile"},{name: "abaya"},{name: "abayas"},{name: "abb"},{name: "abba"},{name: "abbacies"},{name: "abbacy"},{name: "abbas"},
                {name: "abbatial"},{name: "abbe"},{name: "abbed"},{name: "abbes"},{name: "abbess"},{name: "abbesses"},{name: "abbey"},{name: "abbeys"},{name: "abbot"},{name: "abbotcies"},{name: "abbotcy"},
                {name: "abbots"},{name: "abbotship"},{name: "abbotships"},{name: "abbreviate"},{name: "abbreviated"},
                {name: "abbreviates"},{name: "abbreviating"},{name: "abbreviation"},{name: "abbreviations"},{name: "abbreviator"},{name: "abbreviators"},{name: "abbreviatory"},{name: "abbreviature"},{name: "abbreviatures"},{name: "abbs"},
                {name: "abcee"},{name: "abcees"},{name: "abcoulomb"},{name: "abcoulombs"},{name: "abdabs"},{name: "abdicable"},{name: "abdicant"},{name: "abdicate"},{name: "abdicated"},{name: "abdicates"},{name: "abdicating"},
                {name: "abdication"},{name: "abdications"},
                {name: "abdicative"},{name: "abdicator"},{name: "abdicators"},{name: "abdomen"},{name: "abdomens"},{name: "abdomina"},{name: "abdominal"},{name: "abdominally"},{name: "abdominals"},{name: "abdominoplasty"},{name: "abdominous"},
                {name: "abduce"},{name: "abduced"},{name: "abducens"},{name: "abducent"},{name: "abducentes"},{name: "abduces"},{name: "abducing"},{name: "abduct"},{name: "abducted"},{name: "abductee"},{name: "abductees"},
                {name: "abducting"},{name: "abduction"},
                {name: "abductions"},{name: "abductor"},{name: "abductores"},{name: "abductors"},{name: "abducts"},{name: "abeam"},{name: "abear"},{name: "abearing"},{name: "abears"},{name: "abecedarian"},{name: "abecedarians"},
                {name: "abed"},
                {name: "abegging"},{name: "abeigh"},{name: "abele"},{name: "abeles"},{name: "abelia"},{name: "abelian"},{name: "abelias"},{name: "abelmosk"},{name: "abelmosks"},{name: "aberdevine"},{name: "aberdevines"},
                {name: "abernethies"},{name: "abernethy"},
                {name: "aberrance"},{name: "aberrances"},{name: "aberrancies"},{name: "aberrancy"},{name: "aberrant"},{name: "aberrantly"},{name: "aberrants"},{name: "aberrate"},{name: "aberrated"},{name: "aberrates"},
                {name: "aberrating"},
                {name: "aberration"},{name: "aberrational"},{name: "aberrations"},{name: "abessive"},{name: "abessives"},{name: "abet"},{name: "abetment"},{name: "abetments"},{name: "abets"},{name: "abettal"},{name: "abettals"},
                {name: "abetted"},{name: "abetter"},
                {name: "abetters"},{name: "abetting"},{name: "abettor"},{name: "abettors"},{name: "abeyance"},{name: "abeyances"},{name: "abeyancies"},{name: "abeyancy"},{name: "abeyant"},{name: "abfarad"},{name: "abfarads"},
                {name: "abhenries"},{name: "abhenry"},{name: "abhenrys"},{name: "abhominable"},{name: "abhor"},{name: "abhorred"},{name: "abhorrence"},{name: "abhorrences"},{name: "abhorrencies"},{name: "abhorrency"},
                {name: "abhorrent"},{name: "abhorrently"},{name: "abhorrer"},
                {name: "abhorrers"},{name: "abhorring"},{name: "abhorrings"},{name: "abhors"},{name: "abid"},{name: "abidance"},{name: "abidances"},{name: "abidden"},{name: "abide"},{name: "abided"},{name: "abider"},
                {name: "abiders"},{name: "abides"},{name: "abiding"},{name: "abidingly"},{name: "abidings"},{name: "abies"},{name: "abietic"},{name: "abigail"},{name: "abigails"},{name: "abilities"},{name: "ability"},
                {name: "abiogeneses"},{name: "abiogenesis"},{name: "abiogenetic"},
                {name: "abiogenetically"},{name: "abiogenic"},{name: "abiogenically"},{name: "abiogenist"},{name: "abiogenists"},{name: "abiological"},{name: "abioses"},{name: "abiosis"},{name: "abiotic"},{name: "abiotically"},
                {name: "abiotrophic"},{name: "abiotrophies"},{name: "abiotrophy"},{name: "abirritant"},{name: "abirritants"},{name: "abirritate"},{name: "abirritated"},{name: "abirritates"},{name: "abirritating"},{name: "abitur"},{name: "abiturient"},
                {name: "abiturients"},
                {name: "abiturs"},{name: "abject"},{name: "abjected"},{name: "abjecting"},{name: "abjection"},{name: "abjections"},{name: "abjectly"},{name: "abjectness"},{name: "abjectnesses"},{name: "abjects"},{name: "abjoint"},
                {name: "abjointed"},{name: "abjointing"},{name: "abjoints"},{name: "abjunction"},{name: "abjunctions"},{name: "abjuration"},{name: "abjurations"},{name: "abjure"},{name: "abjured"},
                {name: "abjurer"},{name: "abjurers"},{name: "abjures"},{name: "abjuring"},
                {name: "ablactation"},{name: "ablactations"},{name: "ablate"},{name: "ablated"},{name: "ablates"},{name: "ablating"},{name: "ablation"},{name: "ablations"},{name: "ablatitious"},
                {name: "ablatival"},
                {name: "ablative"},{name: "ablatively"},{name: "ablatives"},{name: "ablator"},{name: "ablators"},{name: "ablaut"},{name: "ablauts"},{name: "ablaze"},{name: "able"},{name: "abled"},
                {name: "ablegate"},{name: "ablegates"},{name: "ableism"},{name: "ableisms"},{name: "ableist"},
                {name: "ableists"},{name: "abler"},{name: "ables"},{name: "ablest"},{name: "ablet"},{name: "ablets"},{name: "abling"},{name: "ablings"},{name: "ablins"},{name: "abloom"},
                {name: "ablow"},
                {name: "abluent"},{name: "abluents"},{name: "ablush"},{name: "abluted"},{name: "ablution"},{name: "ablutionary"},{name: "ablutions"},{name: "ablutomane"},{name: "ablutomanes"},
                {name: "ably"},{name: "abmho"},{name: "abmhos"},{name: "abnegate"},{name: "abnegated"},{name: "abnegates"},
                {name: "abnegating"},{name: "abnegation"},{name: "abnegations"},{name: "abnegator"},{name: "abnegators"},{name: "abnormal"},{name: "abnormalism"},{name: "abnormalisms"},
                {name: "abnormalities"},{name: "abnormality"},{name: "abnormally"},{name: "abnormals"},{name: "abnormities"},{name: "abnormity"},{name: "abnormous"},{name: "abo"},{name: "aboard"},{name: "abode"},
                {name: "aboded"},{name: "abodement"},{name: "abodements"},{name: "abodes"},{name: "aboding"},{name: "abohm"},
                {name: "abohms"},{name: "aboideau"},{name: "aboideaus"},{name: "aboideaux"},{name: "aboil"},{name: "aboiteau"},{name: "aboiteaus"},{name: "aboiteaux"},{name: "abolish"},
                {name: "abolishable"},{name: "abolished"},{name: "abolisher"},{name: "abolishers"},{name: "abolishes"},{name: "abolishing"},{name: "abolishment"},{name: "abolishments"},
                {name: "abolition"},{name: "abolitional"},{name: "abolitionary"},{name: "abolitionism"},{name: "abolitionisms"},{name: "abolitionist"},
                {name: "abolitionists"},{name: "abolitions"},{name: "abolla"},{name: "abollae"},{name: "abollas"},{name: "aboma"},{name: "abomas"},{name: "abomasa"},{name: "abomasal"},
                {name: "abomasi"},{name: "abomasum"},
                {name: "abomasus"},{name: "abominable"},{name: "abominableness"},{name: "abominably"},{name: "abominate"},{name: "abominated"},{name: "abominates"},{name: "abominating"},
                {name: "abomination"},{name: "abominations"},{name: "abominator"},
                {name: "abominators"},{name: "abondance"},
                {name: "abondances"},{name: "abonnement"},{name: "abonnements"},{name: "aboon"},{name: "aboral"},{name: "aborally"},
                {name: "abord"},{name: "aborded"},{name: "abording"},{name: "abords"},{name: "abore"},{name: "aborigen"},{name: "aborigens"},{name: "aborigin"},{name: "aboriginal"},{name: "aboriginalism"},{name: "aboriginalisms"},{name: "aboriginalities"},{name: "aboriginality"},{name: "aboriginally"},{name: "aboriginals"},{name: "aborigine"},{name: "aborigines"},
                {name: "aborigins"},{name: "aborne"},{name: "aborning"},{name: "abort"},{name: "aborted"},{name: "abortee"},
                {name: "abortees"},{name: "aborter"},{name: "aborters"},{name: "aborticide"},{name: "aborticides"},{name: "abortifacient"},{name: "abortifacients"},{name: "aborting"},{name: "abortion"},{name: "abortional"},{name: "abortionist"},{name: "abortionists"},{name: "abortions"},{name: "abortive"},{name: "abortively"},{name: "abortiveness"},{name: "abortivenesses"},
                {name: "aborts"},{name: "abortuaries"},{name: "abortuary"},{name: "abortus"},{name: "abortuses"},{name: "abos"},{name: "abought"},{name: "aboulia"},{name: "aboulias"},{name: "aboulic"},{name: "abound"},{name: "abounded"},{name: "abounding"},{name: "abounds"},{name: "about"},{name: "abouts"},{name: "above"},{name: "aboveboard"},{name: "aboveground"},{name: "aboves"},{name: "abracadabra"},{name: "abracadabras"},{name: "abrachia"},{name: "abrachias"},{name: "abradable"},
                {name: "abradant"},{name: "abradants"},{name: "abrade"},{name: "abraded"},{name: "abrader"},{name: "abraders"},{name: "abrades"},{name: "abrading"},{name: "abraid"},{name: "abraided"},{name: "abraiding"},{name: "abraids"},{name: "abram"},{name: "abranchial"},{name: "abranchiate"},{name: "abrasax"},{name: "abrasaxes"},{name: "abrasion"},{name: "abrasions"},{name: "abrasive"},{name: "abrasively"},{name: "abrasiveness"},{name: "abrasivenesses"},{name: "abrasives"},{name: "abraxas"},
                {name: "abraxases"},{name: "abray"},{name: "abrayed"},{name: "abraying"},{name: "abrays"},{name: "abrazo"},{name: "abrazos"},{name: "abreact"},{name: "abreacted"},{name: "abreacting"},{name: "abreaction"},{name: "abreactions"},{name: "abreactive"},{name: "abreacts"},{name: "abreast"},{name: "abrege"},{name: "abreges"},{name: "abri"},{name: "abricock"},{name: "abricocks"},{name: "abridgable"},{name: "abridge"},{name: "abridgeable"},{name: "abridged"},{name: "abridgement"},
                {name: "abridgements"},{name: "abridger"},{name: "abridgers"},{name: "abridges"},{name: "abridging"},{name: "abridgment"},{name: "abridgments"},{name: "abrim"},{name: "abrin"},{name: "abrins"},{name: "abris"},{name: "abroach"},{name: "abroad"},{name: "abroads"},{name: "abrogable"},{name: "abrogate"},{name: "abrogated"},{name: "abrogates"},{name: "abrogating"},{name: "abrogation"},{name: "abrogations"},{name: "abrogative"},{name: "abrogator"},{name: "abrogators"},
                {name: "abrooke"},{name: "abrooked"},{name: "abrookes"},{name: "abrooking"},{name: "abrosia"},{name: "abrosias"},{name: "abrupt"},{name: "abrupter"},{name: "abruptest"},{name: "abruption"},{name: "abruptions"},{name: "abruptly"},{name: "abruptness"},{name: "abruptnesses"},{name: "abrupts"},{name: "abs"},{name: "abscess"},{name: "abscessed"},{name: "abscesses"},{name: "abscessing"},{name: "abscind"},{name: "abscinded"},{name: "abscinding"},{name: "abscinds"},{name: "abscise"},
                {name: "abscised"},{name: "abscises"},{name: "abscisic"},{name: "abscisin"},{name: "abscising"},{name: "abscisins"},{name: "absciss"},{name: "abscissa"},{name: "abscissae"},{name: "abscissas"},{name: "abscisse"},{name: "abscisses"},{name: "abscissin"},{name: "abscissins"},{name: "abscission"},{name: "abscissions"},{name: "abscond"},{name: "absconded"},{name: "abscondence"},{name: "abscondences"},{name: "absconder"},{name: "absconders"},{name: "absconding"},{name: "absconds"},
                {name: "abseil"},{name: "abseiled"},{name: "abseiling"},{name: "abseilings"},{name: "abseils"},{name: "absence"},{name: "absences"},{name: "absent"},{name: "absented"},{name: "absentee"},{name: "absenteeism"},{name: "absenteeisms"},{name: "absentees"},{name: "absenter"},{name: "absenters"},{name: "absenting"},{name: "absently"},{name: "absentminded"},{name: "absentmindedly"},{name: "absentmindedness"},{name: "absentmindednesses"},{name: "absents"},{name: "absey"},
                {name: "abseys"},{name: "absinth"},{name: "absinthe"},{name: "absinthes"},{name: "absinthiated"},{name: "absinthism"},{name: "absinthisms"},{name: "absinths"},{name: "absit"},{name: "absits"},{name: "absolute"},{name: "absolutely"},{name: "absoluteness"},{name: "absolutenesses"},{name: "absoluter"},{name: "absolutes"},{name: "absolutest"},{name: "absolution"},{name: "absolutions"},{name: "absolutise"},{name: "absolutised"},{name: "absolutises"},{name: "absolutising"},
                {name: "absolutism"},{name: "absolutisms"},{name: "absolutist"},{name: "absolutistic"},{name: "absolutists"},{name: "absolutive"},{name: "absolutize"},{name: "absolutized"},{name: "absolutizes"},{name: "absolutizing"},{name: "absolutory"},{name: "absolvable"},{name: "absolve"},{name: "absolved"},{name: "absolvent"},{name: "absolvents"},{name: "absolver"},{name: "absolvers"},{name: "absolves"},{name: "absolving"},{name: "absolvitor"},{name: "absolvitors"},
                {name: "absonant"},{name: "absorb"},{name: "absorbabilities"},{name: "absorbability"},{name: "absorbable"},{name: "absorbance"},{name: "absorbances"},{name: "absorbancies"},{name: "absorbancy"},{name: "absorbant"},{name: "absorbants"},{name: "absorbate"},{name: "absorbates"},{name: "absorbed"},{name: "absorbedly"},{name: "absorbefacient"},{name: "absorbefacients"},{name: "absorbencies"},{name: "absorbency"},{name: "absorbent"},{name: "absorbents"},{name: "absorber"},
                {name: "absorbers"},{name: "absorbing"},{name: "absorbingly"},{name: "absorbs"},{name: "absorptance"},{name: "absorptances"},{name: "absorptiometer"},{name: "absorptiometers"},{name: "absorption"},{name: "absorptions"},{name: "absorptive"},{name: "absorptiveness"},{name: "absorptivities"},{name: "absorptivity"},{name: "absquatulate"},{name: "absquatulated"},{name: "absquatulates"},{name: "absquatulating"},{name: "abstain"},{name: "abstained"},{name: "abstainer"},
                {name: "abstainers"},{name: "abstaining"},{name: "abstains"},{name: "abstemious"},{name: "abstemiously"},{name: "abstemiousness"},{name: "abstemiousnesses"},{name: "abstention"},{name: "abstentionism"},{name: "abstentionisms"},{name: "abstentionist"},{name: "abstentionists"},{name: "abstentions"},{name: "abstentious"},{name: "absterge"},{name: "absterged"},{name: "abstergent"},{name: "abstergents"},{name: "absterges"},{name: "absterging"},{name: "abstersion"},
                {name: "abstersions"},{name: "abstersive"},{name: "abstersives"},{name: "abstinence"},{name: "abstinences"},{name: "abstinencies"},{name: "abstinency"},{name: "abstinent"},{name: "abstinently"},{name: "abstract"},{name: "abstractable"},{name: "abstracted"},{name: "abstractedly"},{name: "abstractedness"},{name: "abstractednesses"},{name: "abstracter"},{name: "abstracters"},{name: "abstractest"},{name: "abstracting"},{name: "abstraction"},{name: "abstractional"},
                {name: "abstractionism"},{name: "abstractionisms"},{name: "abstractionist"},{name: "abstractionists"},{name: "abstractions"},{name: "abstractive"},{name: "abstractively"},{name: "abstractives"},{name: "abstractly"},{name: "abstractness"},{name: "abstractnesses"},{name: "abstractor"},{name: "abstractors"},{name: "abstracts"},{name: "abstrict"},{name: "abstricted"},{name: "abstricting"},{name: "abstriction"},{name: "abstrictions"},{name: "abstricts"},{name: "abstruse"},
                {name: "abstrusely"},{name: "abstruseness"},{name: "abstrusenesses"},{name: "abstruser"},{name: "abstrusest"},{name: "abstrusities"},{name: "abstrusity"},{name: "absurd"},{name: "absurder"},{name: "absurdest"},{name: "absurdism"},{name: "absurdisms"},{name: "absurdist"},{name: "absurdists"},{name: "absurdities"},{name: "absurdity"},{name: "absurdly"},{name: "absurdness"},{name: "absurdnesses"},{name: "absurds"},{name: "abthane"},{name: "abthanes"},{name: "abubble"},
                {name: "abuilding"},{name: "abulia"},{name: "abulias"},{name: "abulic"},{name: "abuna"},{name: "abunas"},{name: "abundance"},{name: "abundances"},{name: "abundancies"},{name: "abundancy"},{name: "abundant"},{name: "abundantly"},{name: "abune"},{name: "aburst"},{name: "abusable"},{name: "abusage"},{name: "abusages"},{name: "abuse"},{name: "abused"},{name: "abuser"},{name: "abusers"},{name: "abuses"},{name: "abusing"},{name: "abusion"},{name: "abusions"},{name: "abusive"},
                {name: "abusively"},{name: "abusiveness"},{name: "abusivenesses"},{name: "abut"},{name: "abutilon"},{name: "abutilons"},{name: "abutment"},{name: "abutments"},{name: "abuts"},{name: "abuttal"},{name: "abuttals"},{name: "abutted"},{name: "abutter"},{name: "abutters"},{name: "abutting"},{name: "abuzz"},{name: "abvolt"},{name: "abvolts"},{name: "abwatt"},{name: "abwatts"},{name: "aby"},{name: "abye"},{name: "abyeing"},{name: "abyes"},{name: "abying"},{name: "abys"},{name: "abysm"},
                {name: "abysmal"},{name: "abysmally"},{name: "abysms"},{name: "abyss"},{name: "abyssal"},{name: "abysses"},{name: "abyssopelagic"},{name: "acacia"},{name: "acacias"},{name: "academe"},{name: "academes"},
                {name: "academia"},{name: "academias"},{name: "academic"},{name: "academical"},{name: "academicalism"},{name: "academicalisms"},{name: "academically"},{name: "academicals"},{name: "academician"},
                {name: "academicians"},{name: "academicism"},{name: "academicisms"},
                {name:"academics"},{name: "academies"},{name: "academism"},{name: "academisms"},{name: "academist"},{name: "academists"},{name: "academy"},{name: "acai"},{name: "acais"},{name: "acajou"},{name: "acajous"},{name: "acalculia"},{name: "acalculias"},{name: "acaleph"},{name: "acalephae"},{name: "acalephan"},{name: "acalephans"},{name: "acalephe"},{name: "acalephes"},{name: "acalephs"},{name: "acanaceous"},{name: "acanth"},{name: "acantha"},{name: "acanthaceous"},{name: "acanthae"},
                {name: "acanthas"},{name: "acanthi"},{name: "acanthin"},{name: "acanthine"},{name: "acanthins"},{name: "acanthocephalan"},{name: "acanthocephalans"},{name: "acanthoid"},{name: "acanthous"},{name: "acanths"},{name: "acanthus"},{name: "acanthuses"},{name: "acapnia"},{name: "acapnias"},{name: "acarbose"},{name: "acarboses"},{name: "acari"},{name: "acarian"},{name: "acariases"},{name: "acariasis"},{name: "acaricidal"},{name: "acaricide"},{name: "acaricides"},{name: "acarid"},
                {name: "acaridan"},{name: "acaridans"},{name: "acaridean"},{name: "acarideans"},{name: "acaridian"},{name: "acaridians"},{name: "acaridomatia"},{name: "acaridomatium"},{name: "acarids"},{name: "acarine"},{name: "acarines"},{name: "acarodomatia"},{name: "acarodomatium"},{name: "acaroid"},{name: "acarologies"},{name: "acarologist"},{name: "acarologists"},{name: "acarology"},{name: "acarophilies"},{name: "acarophily"},{name: "acarpellous"},{name: "acarpelous"},{name: "acarpous"},
                {name: "acarus"},{name: "acatalectic"},{name: "acatalectics"},{name: "acatalepsies"},{name: "acatalepsy"},{name: "acataleptic"},{name: "acataleptics"},{name: "acatamathesia"},{name: "acatamathesias"},{name: "acater"},{name: "acaters"},{name: "acates"},{name: "acathisia"},{name: "acathisias"},{name: "acatour"},{name: "acatours"},{name: "acaudal"},{name: "acaudate"},{name: "acaulescent"},{name: "acauline"},{name: "acaulose"},{name: "acaulous"},{name: "acca"},{name: "accable"},
                {name: "accas"},{name: "accede"},{name: "acceded"},{name: "accedence"},{name: "accedences"},{name: "acceder"},{name: "acceders"},{name: "accedes"},{name: "acceding"},{name: "accelerable"},{name: "accelerando"},{name: "accelerandos"},{name: "accelerant"},{name: "accelerants"},{name: "accelerate"},{name: "accelerated"},{name: "accelerates"},{name: "accelerating"},{name: "acceleratingly"},{name: "acceleration"},{name: "accelerations"},{name: "accelerative"},{name: "accelerator"},
                {name: "accelerators"},{name: "acceleratory"},{name: "accelerometer"},{name: "accelerometers"},{name: "accend"},{name: "accended"},{name: "accending"},{name: "accends"},{name: "accension"},{name: "accensions"},{name: "accent"},{name: "accented"},{name: "accenting"},{name: "accentless"},{name: "accentor"},{name: "accentors"},{name: "accents"},{name: "accentual"},{name: "accentualities"},{name: "accentuality"},{name: "accentually"},{name: "accentuate"},{name: "accentuated"},
                {name: "accentuates"},{name: "accentuating"},{name: "accentuation"},{name: "accentuations"},{name: "accept"},{name: "acceptabilities"},{name: "acceptability"},{name: "acceptable"},{name: "acceptableness"},{name: "acceptablenesses"},{name: "acceptably"},{name: "acceptance"},{name: "acceptances"},{name: "acceptancies"},{name: "acceptancy"},{name: "acceptant"},{name: "acceptants"},{name: "acceptation"},{name: "acceptations"},{name: "accepted"},{name: "acceptedly"},
                {name: "acceptee"},{name: "acceptees"},{name: "accepter"},{name: "accepters"},{name: "acceptilation"},{name: "acceptilations"},{name: "accepting"},{name: "acceptingly"},{name: "acceptingness"},{name: "acceptingnesses"},{name: "acceptive"},{name: "acceptivities"},{name: "acceptivity"},{name: "acceptor"},{name: "acceptors"},{name: "accepts"},{name: "access"},{name: "accessaries"},{name: "accessarily"},{name: "accessariness"},{name: "accessarinesses"},{name: "accessary"},
                {name: "accessed"},{name: "accesses"},{name: "accessibilities"},{name: "accessibility"},{name: "accessible"},{name: "accessibleness"},{name: "accessiblenesses"},{name: "accessibly"},{name: "accessing"},{name: "accession"},{name: "accessional"},{name: "accessioned"},{name: "accessioning"},{name: "accessions"},{name: "accessorial"},{name: "accessories"},{name: "accessorii"},{name: "accessorily"},{name: "accessoriness"},{name: "accessorinesses"},{name: "accessorise"},
                {name: "accessorised"},{name: "accessorises"},{name: "accessorising"},{name: "accessorius"},{name: "accessorize"},{name: "accessorized"},{name: "accessorizes"},{name: "accessorizing"},{name: "accessory"},{name: "acciaccatura"},{name: "acciaccaturas"},{name: "acciaccature"},{name: "accidence"},{name: "accidences"},{name: "accident"},{name: "accidental"},{name: "accidentalism"},{name: "accidentalisms"},{name: "accidentalities"},{name: "accidentality"},{name: "accidentally"},
                {name: "accidentalness"},{name: "accidentalnesses"},{name: "accidentals"},{name: "accidented"},{name: "accidently"},{name: "accidentologies"},{name: "accidentology"},{name: "accidents"},{name: "accidia"},{name: "accidias"},{name: "accidie"},{name: "accidies"},{name: "accinge"},{name: "accinged"},{name: "accinges"},{name: "accinging"},{name: "accipiter"},{name: "accipiters"},{name: "accipitral"},{name: "accipitrine"},{name: "accipitrines"},{name: "accite"},{name: "accited"},
                {name: "accites"},{name: "acciting"},{name: "acclaim"},{name: "acclaimed"},{name: "acclaimer"},{name: "acclaimers"},{name: "acclaiming"},{name: "acclaims"},{name: "acclamation"},{name: "acclamations"},{name: "acclamatory"},{name: "acclimatable"},{name: "acclimatation"},{name: "acclimatations"},{name: "acclimate"},{name: "acclimated"},{name: "acclimates"},{name: "acclimating"},{name: "acclimation"},{name: "acclimations"},{name: "acclimatisable"},{name: "acclimatisation"},
                {name: "acclimatise"},{name: "acclimatised"},{name: "acclimatiser"},{name: "acclimatisers"},{name: "acclimatises"},{name: "acclimatising"},{name: "acclimatizable"},{name: "acclimatization"},{name: "acclimatizations"},{name: "acclimatize"},{name: "acclimatized"},{name: "acclimatizer"},{name: "acclimatizers"},{name: "acclimatizes"},{name: "acclimatizing"},{name: "acclivities"},{name: "acclivitous"},{name: "acclivity"},{name: "acclivous"},{name: "accloy"},{name: "accloyed"},
                {name: "accloying"},{name: "accloys"},{name: "accoast"},{name: "accoasted"},{name: "accoasting"},{name: "accoasts"},{name: "accoied"},{name: "accoil"},{name: "accoils"},{name: "accolade"},{name: "accoladed"},{name: "accolades"},{name: "accolading"},{name: "accommodable"},{name: "accommodate"},{name: "accommodated"},{name: "accommodates"},{name: "accommodating"},{name: "accommodatingly"},{name: "accommodation"},{name: "accommodational"},{name: "accommodationist"},
                {name: "accommodationists"},{name: "accommodations"},{name: "accommodative"},{name: "accommodativeness"},{name: "accommodativenesses"},{name: "accommodator"},{name: "accommodators"},{name: "accompanied"},{name: "accompanier"},{name: "accompaniers"},{name: "accompanies"},{name: "accompaniment"},{name: "accompaniments"},{name: "accompanist"},{name: "accompanists"},{name: "accompany"},{name: "accompanying"},{name: "accompanyist"},{name: "accompanyists"},{name: "accomplice"},
                {name: "accomplices"},{name: "accomplish"},{name: "accomplishable"},{name: "accomplished"},{name: "accomplisher"},{name: "accomplishers"},{name: "accomplishes"},{name: "accomplishing"},{name: "accomplishment"},{name: "accomplishments"},{name: "accompt"},{name: "accomptable"},{name: "accomptant"},{name: "accomptants"},{name: "accompted"},{name: "accompting"},{name: "accompts"},{name: "accorage"},{name: "accoraged"},{name: "accorages"},{name: "accoraging"},{name: "accord"},
                {name: "accordable"},{name: "accordance"},{name: "accordances"},{name: "accordancies"},{name: "accordancy"},{name: "accordant"},{name: "accordantly"},{name: "accorded"},{name: "accorder"},{name: "accorders"},{name: "according"},{name: "accordingly"},{name: "accordion"},{name: "accordionist"},{name: "accordionists"},{name: "accordions"},{name: "accords"},{name: "accost"},{name: "accostable"},{name: "accosted"},{name: "accosting"},{name: "accosts"},{name: "accouchement"},
                {name: "accouchements"},{name: "accoucheur"},{name: "accoucheurs"},{name: "accoucheuse"},{name: "accoucheuses"},{name: "account"},{name: "accountabilities"},{name: "accountability"},{name: "accountable"},{name: "accountableness"},{name: "accountablenesses"},{name: "accountably"},{name: "accountancies"},{name: "accountancy"},{name: "accountant"},{name: "accountants"},{name: "accountantship"},{name: "accountantships"},{name: "accounted"},{name: "accounting"},{name: "accountings"},
                {name: "accounts"},{name: "accouplement"},{name: "accouplements"},{name: "accourage"},{name: "accouraged"},{name: "accourages"},{name: "accouraging"},{name: "accourt"},{name: "accourted"},{name: "accourting"},{name: "accourts"},{name: "accoustrement"},{name: "accoustrements"},{name: "accouter"},{name: "accoutered"},{name: "accoutering"},{name: "accouterment"},{name: "accouterments"},{name: "accouters"},{name: "accoutre"},{name: "accoutred"},{name: "accoutrement"},
                {name: "accoutrements"},{name: "accoutres"},{name: "accoutring"},{name: "accoy"},{name: "accoyed"},{name: "accoying"},{name: "accoyld"},{name: "accoys"},{name: "accredit"},{name: "accreditable"},{name: "accreditation"},{name: "accreditations"},{name: "accredited"},{name: "accrediting"},{name: "accredits"},{name: "accrescence"},{name: "accrescences"},{name: "accrescent"},{name: "accrete"},{name: "accreted"},{name: "accretes"},{name: "accreting"},{name: "accretion"},
                {name: "accretionary"},{name: "accretions"},{name: "accretive"},{name: "accrew"},{name: "accrewed"},{name: "accrewing"},{name: "accrews"},{name: "accroides"},{name: "accruable"},{name: "accrual"},{name: "accruals"},{name: "accrue"},{name: "accrued"},{name: "accruement"},{name: "accruements"},{name: "accrues"},{name: "accruing"},{name: "accubation"},{name: "accubations"},{name: "accultural"},{name: "acculturate"},{name: "acculturated"},{name: "acculturates"},
                {name: "acculturating"},{name: "acculturation"},{name: "acculturational"},{name: "acculturations"},{name: "acculturative"},{name: "accumbencies"},{name: "accumbency"},{name: "accumbent"},{name: "accumulable"},{name: "accumulate"},{name: "accumulated"},{name: "accumulates"},{name: "accumulating"},{name: "accumulation"},{name: "accumulations"},{name: "accumulative"},{name: "accumulatively"},{name: "accumulativeness"},{name: "accumulativenesses"},{name: "accumulator"},
                {name: "accumulators"},{name: "accuracies"},{name: "accuracy"},{name: "accurate"},{name: "accurately"},{name: "accurateness"},{name: "accuratenesses"},{name: "accurse"},{name: "accursed"},{name: "accursedly"},{name: "accursedness"},{name: "accursednesses"},{name: "accurses"},{name: "accursing"},{name: "accurst"},{name: "accusable"},{name: "accusably"},{name: "accusal"},{name: "accusals"},{name: "accusant"},{name: "accusants"},{name: "accusation"},{name: "accusations"},
                {name: "accusatival"},{name: "accusative"},{name: "accusatively"},{name: "accusatives"},{name: "accusatorial"},{name: "accusatory"},{name: "accuse"},{name: "accused"},{name: "accusement"},{name: "accusements"},{name: "accuser"},{name: "accusers"},{name: "accuses"},{name: "accusing"},{name: "accusingly"},{name: "accustom"},{name: "accustomary"},{name: "accustomation"},{name: "accustomations"},{name: "accustomed"},{name: "accustomedness"},{name: "accustomednesses"},
                {name: "accustoming"},{name: "accustoms"},{name: "accustrement"},{name: "accustrements"},{name: "ace"},{name: "aced"},{name: "acedia"},{name: "acedias"},{name: "aceldama"},{name: "aceldamas"},{name: "acellular"},{name: "acentric"},{name: "acentrics"},{name: "acephalic"},{name: "acephalous"},{name: "acequia"},{name: "acequias"},{name: "acer"},{name: "aceraceous"},{name: "acerate"},{name: "acerated"},{name: "acerb"},{name: "acerbate"},{name: "acerbated"},{name: "acerbates"},
                {name: "acerbating"},{name: "acerber"},{name: "acerbest"},{name: "acerbic"},{name: "acerbically"},{name: "acerbities"},{name: "acerbity"},{name: "acerola"},{name: "acerolas"},{name: "acerose"},{name: "acerous"},{name: "acers"},{name: "acervate"},{name: "acervately"},{name: "acervation"},{name: "acervations"},{name: "acervuli"},{name: "acervulus"},{name: "aces"},{name: "acescence"},{name: "acescences"},{name: "acescencies"},{name: "acescency"},{name: "acescent"},
                {name: "acescents"},{name: "aceta"},{name: "acetabula"},{name: "acetabular"},{name: "acetabulum"},{name: "acetabulums"},{name: "acetal"},{name: "acetaldehyde"},{name: "acetaldehydes"},{name: "acetals"},{name: "acetamid"},{name: "acetamide"},{name: "acetamides"},{name: "acetamids"},{name: "acetaminophen"},{name: "acetaminophens"},{name: "acetanilid"},{name: "acetanilide"},{name: "acetanilides"},{name: "acetanilids"},{name: "acetate"},{name: "acetated"},{name: "acetates"},
                {name: "acetazolamide"},{name: "acetazolamides"},{name: "acetic"},{name: "acetification"},{name: "acetifications"},{name: "acetified"},{name: "acetifier"},{name: "acetifiers"},{name: "acetifies"},{name: "acetify"},{name: "acetifying"},{name: "acetin"},{name: "acetins"},{name: "acetometer"},{name: "acetometers"},{name: "acetonaemia"},{name: "acetonaemias"},{name: "acetone"},{name: "acetonemia"},{name: "acetonemias"},{name: "acetones"},{name: "acetonic"},{name: "acetonitrile"},
                {name: "acetonitriles"},{name: "acetonuria"},{name: "acetonurias"},{name: "acetophenetidin"},{name: "acetophenetidins"},{name: "acetose"},{name: "acetous"},{name: "acetoxyl"},{name: "acetoxyls"},{name: "acetum"},{name: "acetyl"},{name: "acetylate"},{name: "acetylated"},{name: "acetylates"},{name: "acetylating"},{name: "acetylation"},{name: "acetylations"},{name: "acetylative"},{name: "acetylcholine"},{name: "acetylcholines"},{name: "acetylcholinesterase"},
                {name: "acetylcholinesterases"},{name: "acetylene"},{name: "acetylenes"},{name: "acetylenic"},{name: "acetylic"},{name: "acetylide"},{name: "acetylides"},{name: "acetyls"},{name: "acetylsalicylate"},{name: "acetylsalicylates"},{name: "acetylsalicylic"},{name: "ach"},{name: "achaenia"},{name: "achaenium"},{name: "achaeniums"},{name: "achaenocarp"},{name: "achaenocarps"},{name: "achage"},{name: "achages"},{name: "achalasia"},{name: "achalasias"},{name: "achar"},
                {name: "acharne"},{name: "achars"},{name: "acharya"},{name: "acharyas"},{name: "achates"},{name: "ache"},{name: "ached"},{name: "achene"},{name: "achenes"},{name: "achenia"},{name: "achenial"},{name: "achenium"},{name: "acheniums"},{name: "aches"},{name: "achier"},{name: "achiest"},{name: "achievable"},{name: "achieve"},{name: "achieved"},{name: "achievement"},{name: "achievements"},{name: "achiever"},{name: "achievers"},{name: "achieves"},{name: "achieving"},
                {name: "achillea"}
    ];

    return arr;
  }
}
