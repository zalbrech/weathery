import { Injectable, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Weather } from '../classes/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private theApiKey = '&appid=d54c5e6f719f6b43909a22379060606b';

  private baseUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';

  public theWeather = new Observable<Weather>();

  private monthStrings:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 
                                   'May', 'Jun', 'Jul', 'Aug', 
                                   'Sep', 'Oct', 'Nov', 'Dec'];

  private dayStrings:string[] = ['Sun', 'Mon', 'Tue', 'Wed',
                                 'Thu', 'Fri', 'Sat'];                            

  constructor(private httpClient: HttpClient) {
    console.log('***********************\nin WeatherService constructor\n');
    
    
   }

  getWeather() {

  }

  getCityWeather(theCity: string): Observable<any> {
    const searchUrl = `${this.baseUrl}${theCity}${this.theApiKey}`;
    this.httpClient.get(searchUrl).subscribe(
      data => {
        console.log(data);
      });

    return this.httpClient.get<any>(searchUrl);

  }
  // getCityWeather(theCity: string): Observable<GetResponseWeather> {
  //   console.log("getCityWeather() called");

  //   const searchUrl = `${this.baseUrl}${theCity}${this.theApiKey}`;

  //   // console.log(this.theJSON);
  //   // this.httpClient.get<GetWeather>(searchUrl);
  //   this.httpClient.get(searchUrl).subscribe(
  //     (data: any) => {
  //       console.log('inside httpClient.get');
  //       console.log(data);
  //       this.theWeather = data;



  //       console.log(this.theWeather);
  //       this.theTemperatureFarenheit = (data.main.temp -273.15) * 9/5 + 32;
  //       this.theTemperatureCelsius = data.main.temp - 273.15;
  //       this.theTimezone = data.timezone;
        
  //       //const myDate = Date.now() + this.theTimezone;
  //       //const dateTest = Date.now();

  //       console.log('The temp farenheit is ' + this.theTemperatureFarenheit);
  //       console.log('The temp celsius is ' + this.theTemperatureCelsius);
  //       console.log('The timezone is ' + this.theTimezone);
        
  //       const localDate = new Date();

  //       const theOffsetMilli = (localDate.getTimezoneOffset() * 60000) + (this.theTimezone * 1000);
        
  //       console.log('local date offset is ' + localDate.getTimezoneOffset() + ' minutes');
       

  //       this.theDate = new Date(Date.now() + theOffsetMilli);
  //       console.log(this.theDate);
        
  //       console.log(this.getFormattedTime(this.theDate));
  //       console.log(this.getFormattedDate(this.theDate));  
        
        
        
  //     }
  //   )
  //   return this.httpClient.get<GetResponseWeather>(searchUrl);
  // }

  // format time output
  getFormattedTime(theDate: Date) : string {
    var theHour: number = theDate.getHours();
    var theMinutes: number = theDate.getMinutes();

    // insert leading 0 if needed
    if(theMinutes < 10) {
      return theHour + ":0" + theMinutes;
    } else {
      return theHour + ":" + theMinutes;
    }
  }

  getFormattedUTC(theTimezone: number, value: number) : string {
    var tempDate: Date = new Date((value * 1000));
    var userOffset = tempDate.getTimezoneOffset() * 60000;
    tempDate = new Date(tempDate.getTime() + userOffset + (theTimezone * 1000));

    return this.getFormattedTime(tempDate);
  }

  // format day of the week, month, and day
  getFormattedDate(theDate: Date) : string {
    var theDay: string = this.getDayString(theDate.getDay());
    var theMonth: string = this.getMonthString(theDate.getMonth());
    var dayOfWeek: string = this.getDayOfWeek(theDate.getDate());

    var result: string = theDay + ', ' + theMonth + ' ' + dayOfWeek;

    return result;
  }

  // helper method to convert 0 indexed number into month string
  getMonthString(theMonth: number) : string {
    return this.monthStrings[theMonth];
  }

  // helper method to append proper ordinal number suffix
  getDayOfWeek(theDay: number) : string {
    var theSuffix: string = '';
    if(theDay % 100 > 10 && theDay % 100 < 21) {
      theSuffix = 'th';
    } else if(theDay % 10 == 1) {
      theSuffix = 'st';
    } else if(theDay % 10 == 2) {
      theSuffix = 'nd';
    } else if(theDay % 10 == 3) {
      theSuffix = 'rd';
    } else {
      theSuffix = 'th';
    }

    return theDay + theSuffix;
  }

  // convert number to string
  getDayString(theDay: number) : string {
    return this.dayStrings[theDay];
  }

}


