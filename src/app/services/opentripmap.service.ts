import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenTripMapService {
  private apiKey: string = '5ae2e3f221c38a28845f05b60c092a1dda9b0beb41295766e9eecad5';
  private apiUrl: string = 'https://api.opentripmap.com/0.1/en/places/';

  constructor(private http: HttpClient) {}

  searchDestinos(query: string): Observable<any> {
    const url = `${this.apiUrl}autosuggest?name=${query}&radius=52742000&lon=-33.4461946&lat=-70.6596326&rate=3&limit=5&&apikey=${this.apiKey}`;
    return this.http.get(url);
  }

  getPlaceDetails(xid: string): Observable<any> {
    const url = `${this.apiUrl}xid/${xid}?apikey=${this.apiKey}`;
    return this.http.get(url);
  }
}
