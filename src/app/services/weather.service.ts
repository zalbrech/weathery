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
        console.log('theTime is ' + theTime);
        console.log('The day is ' + theTime.getDay() + ' and the date is ' + theTime.getDate());

        console.log('dateTest = ' + dateTest);
        console.log('myDateTest = ' + myDateTest);

        console.log('---------------');
        console.log(new Date((data.dt*1000)+(data.timezone*1000)));

        console.log('---------------');
        console.log(data.dt);
        console.log(Math.floor(Date.now() / 1000));

        console.log('--------------');
        const localDate = new Date();
        const theOffset = localDate.getTimezoneOffset();
        const theOffsetMilli = (theOffset * 60000) + (this.theTimezone * 1000);
        console.log(localDate);
        console.log(theOffset);
        console.log(theOffsetMilli);

        console.log(new Date(Date.now() + theOffsetMilli));
        

      }
    )

    // return this.httpClient.get(searchUrl);

    // this.httpClient.get(searchUrl).subscribe(data => console.log(data));
  }
}

interface GetResponseWeather {

}

