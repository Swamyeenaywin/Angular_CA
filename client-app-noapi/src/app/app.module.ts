import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search.component';
import { DisplayComponent } from './components/display.component';
import { GiphyService } from './giphy.service';
import { RetrieveGiphyComponent } from './components/retrieve-giphy.component';
import { RetrieveDisplayComponent } from './components/retrieve-display.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    DisplayComponent,
    RetrieveGiphyComponent,
    RetrieveDisplayComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [GiphyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
