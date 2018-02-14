import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {GiphyService} from '../giphy.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('searchForm')
  searchForm: NgForm;

  constructor(private giphyService: GiphyService) { }

  ngOnInit() {
  }
  searchGiphyComponent() {
    //console.log('>> giphy service: ', this.searchForm.value.searchText);
    this.giphyService.giphySearchEvent.next(this.searchForm.value.searchText);
    sessionStorage.setItem("searchTerm",this.searchForm.value.searchText);
  }

}
