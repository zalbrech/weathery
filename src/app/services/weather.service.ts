import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Weather } from '../classes/weather';
import { HeaderComponent } from '../components/header/header.component';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private googleBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  private googleApiKey = '&key=AIzaSyB1vlGaFYk2PYrsSeSyUYxfLFE7UdkqMSY';

  private theApiKey = '&appid=d54c5e6f719f6b43909a22379060606b';

  private geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=';


  private oneCallUrl = 'https://api.openweathermap.org/data/3.0/onecall?';

  private unitPrefix = '&units=';

  private theUnits = 'imperial';

  private theLimit = '&limit=1';

  private theExclusions = '&exclude=minutely,hourly,alerts';

  private zipBaseUrl = 'https://app.zipcodebase.com/api/v1/search?';
  private zipAPIKey = 'apikey=d3d13780-0706-11ed-9f70-d7269a0b63b2';
  private zipCodePrefix = '&codes='
  private zipCountry = '&country=US'

  public theWeather = new Observable<Weather>();

  private unitSource;
  unitMessage;

  private monthStrings: string[] = ['Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'];

  private dayStrings: string[] = ['Sun', 'Mon', 'Tue', 'Wed',
    'Thu', 'Fri', 'Sat'];

  constructor(private httpClient: HttpClient) {
    this.unitSource = new BehaviorSubject<string>('F');
    this.unitMessage = this.unitSource.asObservable();
  }

  getCoordinates(input: string): Observable<any> {
    let searchUrl = `${this.geoUrl}${input}${this.theLimit}${this.theApiKey}${this.unitPrefix}${this.theUnits}`;

    // debugging only
    this.httpClient.get<any>(searchUrl).subscribe(
      data => {
        console.log(data);
      });

    return this.httpClient.get<any>(searchUrl);
  }

  // getZipCoordinates(input: string): Observable<any> {
  //   console.log('zip input is ' + input);
  //   const searchUrl = `${this.zipBaseUrl}${this.zipAPIKey}${this.zipCodePrefix}${input}${this.zipCountry}`;

  //   // debugging only
  //   this.httpClient.get<any>(searchUrl).subscribe(
  //     data => {
  //       console.log(data);
  //       let s = JSON.stringify(data);
  //       console.log(JSON.parse(s));
  //     });


  //   return this.httpClient.get<any>(searchUrl);
  // }

  // retrieve weather data from OpenWeather OneCall API
  getOneCallWeather(latitude: string, longitude: string): Observable<any> {
    console.log('searching weather for ' + latitude + ", " + longitude);
    let cords = 'lat=' + latitude + '&lon=' + longitude;
    let searchUrl = `${this.oneCallUrl}${cords}${this.theExclusions}${this.theApiKey}${this.unitPrefix}${this.theUnits}`;

    // debugging only
    // console.log(searchUrl);
    // this.httpClient.get(searchUrl).subscribe(
    //   data => {
    //     console.log(data);
    //   });

    return this.httpClient.get<any>(searchUrl);
  }

  getZipCoordinates(input: string): Observable<any> {
    const searchUrl = `${this.googleBaseUrl}${input}${this.googleApiKey}`;

    // debugging only
    console.log(searchUrl);
    this.httpClient.get(searchUrl).subscribe(
      data => {
        console.log(data);
      });

    return this.httpClient.get<any>(searchUrl);
  }


  // format time output
  getFormattedTime(theDate: Date): string {
    var theHour: number = theDate.getHours();
    var theMinutes: number = theDate.getMinutes();

    var theMerides: string = " AM";

    // AM / PM formatting    

    if (theHour == 12) {
      theMerides = " PM";
    }

    if (theHour > 12) {
      theHour -= 12;
      theMerides = " PM";
    }

    if (theHour == 0) {
      theHour = 12;
    }

    // insert leading 0 if needed
    if (theMinutes < 10) {
      return theHour + ":0" + theMinutes + theMerides;
    } else {
      return theHour + ":" + theMinutes + theMerides;
    }
  }

  // format UTC time
  getFormattedUTC(theTimezone: number, value: number): string {
    var tempDate: Date = new Date((value * 1000));
    var userOffset = tempDate.getTimezoneOffset() * 60000;
    tempDate = new Date(tempDate.getTime() + userOffset + (theTimezone * 1000));

    return this.getFormattedTime(tempDate);
  }

  // format day of the week, month, and day
  getFormattedDate(theDate: Date): string {
    var theDay: string = this.getDayString(theDate.getDay());
    var theMonth: string = this.getMonthString(theDate.getMonth());
    var dayOfWeek: string = this.getDayOfWeek(theDate.getDate());

    var result: string = theDay + ', ' + theMonth + ' ' + dayOfWeek;

    return result;
  }

  // convert number to day of the week string abbreviation
  getDayString(theDay: number): string {
    return this.dayStrings[theDay];
  }

  setUnits(newUnits: string) {
    let tempUnits = newUnits === 'IMPERIAL' ? 'F' : 'C';
    this.theUnits = newUnits;
    this.unitSource.next(tempUnits);
  }

  // ** private methods **

  // helper method to convert 0 indexed number into month string
  private getMonthString(theMonth: number): string {
    return this.monthStrings[theMonth];
  }

  // helper method to append proper ordinal number suffix
  private getDayOfWeek(theDay: number): string {
    var theSuffix: string = '';
    if (theDay % 100 > 10 && theDay % 100 < 21) {
      theSuffix = 'th';
    } else if (theDay % 10 == 1) {
      theSuffix = 'st';
    } else if (theDay % 10 == 2) {
      theSuffix = 'nd';
    } else if (theDay % 10 == 3) {
      theSuffix = 'rd';
    } else {
      theSuffix = 'th';
    }

    return theDay + theSuffix;
  }
}


