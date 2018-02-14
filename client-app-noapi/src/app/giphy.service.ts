import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import { HttpResponse } from '@angular/common/http/src/response';

@Injectable()
export class GiphyService {
    
  static readonly APIKEY = "ENTER OWN API HERE";

  giphySearchEvent = new EventEmitter<string>();
  retrieveGiphyEvent= new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  searchGiphy(searchText: string, offset:number): Promise<any> {
     
    let qs = new HttpParams()
    .set('api_key',GiphyService.APIKEY)
      .set('q', searchText)
      .set('limit','8')
      .set('offset',offset.toString());
    //Returns an observable
    return (
      this.http.get('https://api.giphy.com/v1/gifs/search', {params: qs})
          .take(1) //from observable take 1 from the stream
          .toPromise()
        .then((result) => {
          console.log(">>>result: ",result);
          return (result);
        })
    ); //convert the event to a promise
  }
  retrieveGiphy(user: string): Promise<any> {
    return (this.http.get('/server-app/giphy?user='+user)
      .take(1)
      .toPromise())
  
  }
  saveGiphy(url:string,jsonString: Object):Promise<any>  {
  return (this.http.post(url, JSON.stringify(jsonString), {headers:{'Content-Type': 'application/json'}})
  .take(1)
  .toPromise())
  
  }
}
