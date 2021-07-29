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
  private theLocalTime: Date = new Date(0);
  private utcSeconds: number = 0;

  private monthStrings:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 
                                   'May', 'Jun', 'Jul', 'Aug', 
                                   'Sep', 'Oct', 'Nov', 'Dec'];

  private dayStrings:string[] = ['Sun', 'Mon', 'Tue', 'Wed',
                                 'Thu', 'Fri', 'Sat'];                            

  constructor(private httpClient: HttpClient) { }

  getCityWeather(theCity: string) {

    const searchUrl = `${this.baseUrl}${theCity}${this.theApiKey}`;

    // console.log(JSON.stringify(searchUrl));

    this.httpClient.get(searchUrl).subscribe(
      (data: any) => {
        console.log(data);
        this.theTemperature = data.main.temp;
        this.theTimezone = data.timezone;
        // var localOffset = utcSeconds - this.theTimezone;
        const myDate = Date.now() + this.theTimezone;
        const theTime = new Date(myDate);
        const dateTest = Date.now();
        const myDateTest = new Date(dateTest);

        console.log('The temp is ' + this.theTemperature);
        console.log('The timezone is ' + this.theTimezone);
        // console.log('theTime is ' + theTime);
        // console.log('The day is ' + theTime.getDay() + ' and the date is ' + theTime.getDate());

        // console.log('dateTest = ' + dateTest);
        // console.log('myDateTest = ' + myDateTest);

        // console.log('---------------');
        // console.log(new Date((data.dt*1000)+(data.timezone*1000)));

        // console.log('---------------');
        // console.log(data.dt);
        // console.log(Math.floor(Date.now() / 1000));

        // console.log('--------------');
        const localDate = new Date();
        const theOffset = localDate.getTimezoneOffset();
        const theOffsetMilli = (theOffset * 60000) + (this.theTimezone * 1000);
        // console.log(localDate);
        console.log('local date offset is ' + theOffset + ' minutes');
        //console.log(theOffsetMilli);

        this.theDate = new Date(Date.now() + theOffsetMilli);
        console.log(this.theDate);
        console.log(this.theDate.getHours() + ':' + this.theDate.getMinutes());
        
        console.log(this.getFormattedTime(this.theDate));
      
        console.log(this.getFormattedDate(this.theDate));            

        
                    
      }
    )

    // return this.httpClient.get(searchUrl);

    // this.httpClient.get(searchUrl).subscribe(data => console.log(data));
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

  // helper method to convert 0 indexed number into Month string
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

