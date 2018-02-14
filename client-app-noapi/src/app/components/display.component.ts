import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import {GiphyService} from '../giphy.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, OnDestroy {

  @Input()
  searchText = '';
  
  imageArray=[];


  //For saving images
savedImageUrlArray=[];
selected={};
toSaveJsonArray=[];

  @ViewChild('saveForm')
  saveForm: NgForm;


  private sub: Subscription;

  private offset:number = 0;
  private window:Window;

  constructor(private http: HttpClient, private giphySvc: GiphyService) { }

  ngOnInit() {
    //For new values
    this.sub = this.giphySvc.giphySearchEvent.subscribe(
      (data) => {
       // console.log('>>> giphy service event: ', data);
        this.giphySvc.searchGiphy(data, this.offset)
          .then((result) => {
            this.imageArray = result.data;
         //   console.log('>>> images: ', this.imageArray);
          });
      },
      (error) => {
        console.log('>>> giphy service error: ', error);
      }
    );

    //Default data (not necessary)
      // this.giphySvc.searchGiphy(this.searchText,this.offset)  //this returns a promise
      // .then(result => {
        
      //   this.imageArray = result.data;
      // //  console.log('>>> images: ', this.imageArray);
      // }).catch(error => {
      //     console.log('>> error: ', error);
      // });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logCheckbox(e): void {
    if(e.target.checked){
      var id = e.target.getAttribute('id');
      this.selected[id]=e.target.getAttribute('value');
      console.log(">>>Selected object"+id)
     // this.savedImageUrlArray.push(e.target.value)
    }else{
      delete this.selected[e.target.getAttribute('id')];
    }
  }

  formSaveGiphy(isValid: boolean) {


    if (!isValid) return;
   // console.log(">>>Selected images: "+ this.selected);
   //For saving data, create JSON with keys: username, dateselected, imageurl
   var user = this.saveForm.value.username;
   var timeselected = this.converDateToMysql(new Date());
    this.savedImageUrlArray = Object.values(this.selected);
       //console.log(">>>Selected images User: "+ user);
    //console.log(">>>Selected images Date: "+ dateselected);
    //console.log(">>>Selected images Array: "+ this.savedImageUrlArray);
    for (let imgUrl of this.savedImageUrlArray){
      let x = { 
        "user" : user, 
       "timeselected":timeselected,
       "imageurl":imgUrl};
       this.toSaveJsonArray.push(x);
    }
    // for (let x of this.toSaveJsonArray){
    // console.log(">>>Selected images JSONArray: "+ x.user+","+x.timeselected+","+x.imageurl);
    // }
    let newX = {
      "data":this.toSaveJsonArray
    }
    var url = "/server-app/giphy";
    var jsonString = JSON.stringify(newX);
    console.log(">>>Jsonstring is: "+jsonString);
   
    this.giphySvc.saveGiphy(url,newX)
          .then((result) => {
          console.log('>>> save Images: ', result);
          });

          this.acknowledgeSaved();
     
}
  nextPage(){

    this.offset+=8;
    //console.log(">>> nextPage offset count", this.offset);
    var searchString = sessionStorage.getItem("searchTerm");
    this.giphySvc.searchGiphy(searchString,this.offset)  //this returns a promise
    .then(result => {
      
      this.imageArray = result.data;
     // console.log('>>> imagesPaged: ', this.imageArray);
     });
     
  }

 twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
converDateToMysql(date:Date):string {
  return date.getUTCFullYear() + "-" 
  + this.twoDigits(1 + date.getUTCMonth()) + "-" 
  + this.twoDigits(date.getUTCDate()) + " " 
  + this.twoDigits(date.getUTCHours()) + ":" 
  + this.twoDigits(date.getUTCMinutes()) + ":"
  + this.twoDigits(date.getUTCSeconds());
};
acknowledgeSaved(){
          //Clear Arrays after save
          this.savedImageUrlArray=[];
          this.selected={};
          this.toSaveJsonArray=[];
          this.saveForm.reset();
          window.alert("Saved!");
}


  
}
