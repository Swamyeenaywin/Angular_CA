import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {GiphyService} from '../giphy.service';

@Component({
  selector: 'app-retrieve-giphy',
  templateUrl: './retrieve-giphy.component.html',
  styleUrls: ['./retrieve-giphy.component.css']
})
export class RetrieveGiphyComponent implements OnInit {

  constructor(private giphyService: GiphyService) { }
  
  @ViewChild('retrieve')
  retrieve: NgForm;
  
  ngOnInit() {
    
  }
  giphyForUser(){
    this.giphyService.retrieveGiphyEvent.next(this.retrieve.value.user);
    console.log("retrieve-giphy clicked");
  }
  
}
