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

  private theUnits = '&units=imperial';

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
    const searchUrl = `${this.baseUrl}${theCity}${this.theApiKey}${this.theUnits}`;
    this.httpClient.get(searchUrl).subscribe(
      data => {
        console.log(data);
      });

    return this.httpClient.get<any>(searchUrl);

  }

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


