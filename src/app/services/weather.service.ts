import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private theApiKey = '&appid=d54c5e6f719f6b43909a22379060606b';

  private baseUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';

  private theDate: Date = new Date(Date.now());

  private theTemperature: number = 0;
  private theTimezone: number = 0;

  private monthStrings:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 
                                   'May', 'Jun', 'Jul', 'Aug', 
                                   'Sep', 'Oct', 'Nov', 'Dec'];

  private dayStrings:string[] = ['Sun', 'Mon', 'Tue', 'Wed',
                                 'Thu', 'Fri', 'Sat'];                            

  constructor(private httpClient: HttpClient) { }

  getCityWeather(theCity: string) {

    const searchUrl = `${this.baseUrl}${theCity}${this.theApiKey}`;

    this.httpClient.get(searchUrl).subscribe(
      (data: any) => {
        console.log(data);
        this.theTemperature = data.main.temp;
        this.theTimezone = data.timezone;
        
        const myDate = Date.now() + this.theTimezone;
        const theTime = new Date(myDate);
        const dateTest = Date.now();
        const myDateTest = new Date(dateTest);

        console.log('The temp is ' + this.theTemperature);
        console.log('The timezone is ' + this.theTimezone);
        
        const localDate = new Date();

        const theOffsetMilli = (localDate.getTimezoneOffset() * 60000) + (this.theTimezone * 1000);
        
        console.log('local date offset is ' + localDate.getTimezoneOffset + ' minutes');
       

        this.theDate = new Date(Date.now() + theOffsetMilli);
        console.log(this.theDate);
        
        console.log(this.getFormattedTime(this.theDate));
        console.log(this.getFormattedDate(this.theDate));            

        
                    
      }
    )
  }

  // format time output
  getFormattedTime(theDate: Date) : string {
    var theHour: number = this.theDate.getHours();
    var theMinutes: number = this.theDate.getMinutes();

    // insert leading 0 if needed
    if(theMinutes < 10) {
      return theHour + ":0" + theMinutes;
    } else {
      return theHour + ":" + theMinutes;
    }
  }

  // format day of the week, month, and day
  getFormattedDate(theDate: Date) : string {
    var theDay: string = this.getDayString(theDate.getDay());
    var theMonth: string = this.getMonthString(theDate.getMonth());
    var dayOfWeek: string = this.getDayOfWeek(theDate.getDate());

    var result: string = theDay + ' ' + theMonth + ', ' + dayOfWeek;

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

  // convert 
  getDayString(theDay: number) : string {
    return this.dayStrings[theDay];
  }


}

interface GetResponseWeather {

}

