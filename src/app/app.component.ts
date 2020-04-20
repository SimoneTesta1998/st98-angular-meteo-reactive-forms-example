import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, debounceTime, distinctUntilChanged,
 filter, withLatestFrom, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SettingsServces } from './core/services/settings.services';

@Component({
  selector: 'my-app',
  template: `
  <input type='text' placeholder='city' [formControl]='cityInput'>
  <h1 *ngIf='meteo'>Temperature: {{meteo?.main.temp}}°</h1>
  <hr>
  <button (click)='settingServices.setMetric(true)'>METRIC</button>
  <button (click)='settingServices.setMetric(false)'>IMPERIAL</button>
  `,
  styles: []
})
export class AppComponent  {
  cityInput: FormControl = new FormControl();
  meteo: any;
  constructor(http: HttpClient, private settingServices: SettingsServces) {
    this.cityInput.valueChanges
      .pipe(
        debounceTime(750),
        filter(n => n.length > 3),
        distinctUntilChanged(),
        withLatestFrom(this.settingServices.isMetric$),
        map(([city, unit]) => [city, unit ? 'metric' : 'imperial']),
        switchMap(([city, unit] : [string, string]) => { 
          return http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&APPID=2f1f81d76b3ed1c475c8bb650f88ccfa`)
          .pipe(
            catchError(() => of(null))
          )
        })
      )
      .subscribe(
        meteo => this.meteo = meteo
      )
  }
  /*constructor(http: HttpClient) {
    // E' una bad pratices usare due subscribe nidificate
    this.city.valueChanges
      .subscribe(
        city => (
          
          .subscribe(
            res => this.meteo = res,
            err => this.meteo = null
          )
        )
      )
  }*/
}
