import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import {GiphyService} from '../giphy.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-retrieve-display',
  templateUrl: './retrieve-display.component.html',
  styleUrls: ['./retrieve-display.component.css']
})
export class RetrieveDisplayComponent implements OnInit {

  private sub: Subscription;
  savedImageArray:any[] =[];

  constructor(private http: HttpClient, private giphySvc: GiphyService) { }
 

  ngOnInit() {
     //For new values
     this.sub = this.giphySvc.retrieveGiphyEvent.subscribe(
      (data) => {
       // console.log('>>> giphy service event: ', data);
        this.giphySvc.retrieveGiphy(data)
          .then((result) => {
            this.savedImageArray = result;
            console.log('>>> retrieved images: ', this.savedImageArray);
          });
      },
      (error) => {
        console.log('>>> giphy service error: ', error);
      }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
