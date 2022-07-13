import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Weather } from 'src/app/classes/weather';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';
import { WeatherService } from 'src/app/services/weather.service';
import { BackgroundComponent } from '../background/background.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
  animations: [
    trigger('flyIn', [
      transition(':enter', [
        style({ transform: 'translateY(200%)' }),
        animate('1.2s .75s ease-in-out', style({ transform: 'translateY(0%)' }))
      ])
    ])
  ]
})

export class WeatherDisplayComponent implements OnInit {

  isLoaded: boolean;
  theTemperatureFarenheit: number;
  message: string;
  status: string;

  theIconPath: string;

  theUnits: string;

  numRegex;
  zipRegex;
  delimiterRegex;
  alphabetRegex;

  constructor(private weatherService: WeatherService,
    private route: ActivatedRoute,
    private router: Router,
    public theWeather: Weather,
    public backgroundComponent: BackgroundComponent,
    public themeService: ThemeService,
    public dataService: DataService,
    public httpClient: HttpClient
  ) {
    this.isLoaded = false;
    this.theTemperatureFarenheit = 0;
    this.message = "";
    this.status = "";
    this.theIconPath = "assets/images/weather-icons/";
    this.theUnits = "";

    //Regex
    this.numRegex = new RegExp(/\d/g);
    this.zipRegex = new RegExp((/(^\d{5}$)|(^\d{5}-\d{4}$)/));
    this.delimiterRegex = new RegExp('[\s,]');
    this.alphabetRegex = new RegExp('[a-zA-Z]');
  }

  ngOnInit(): void {
    console.log('in WeatherDisplay OnInit');
    this.getLocalTime();
    this.route.paramMap.subscribe(() => {
      this.parseInput();
    });

    this.themeService.currentMessage.subscribe(message => this.message = message);
    this.weatherService.unitMessage.subscribe(units => this.theUnits = units);
  }

  parseInput() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')?.toUpperCase()!;

    //check response code
    // if search string is invalid, redirect to 404 component

    // prevent searching empty string
    if (theKeyword.length < 1) {
      return;
    }
    // check if input contains digits, if so search input as zip code
    // zip code only for United States
    if (this.numRegex.test(theKeyword)) {
      if (this.zipRegex.test(theKeyword)) {
        console.log('zip code entered');
        this.handleZipSearch(theKeyword.substring(0, 5));
      } else {
        // redirect to 404 page
        this.router.navigateByUrl('/');
      }
    } else {
      // parse input
      var begin: number = 0, end: number;

      // test for incorrectly entered non-letters at beginning of string
      // this method currently only works for Latin based languages
      while (!this.isLetter(theKeyword.charAt(begin)) && begin < theKeyword.length) {
        begin++;
      }

      let list = new Array();

      // parse search string, splitting via ',' delimiter 
      for (end = begin; end < theKeyword.length; end++) {
        if (theKeyword.charAt(end) == ',') {
          if (theKeyword.substring(begin, end).length > 1) {
            list.push(theKeyword.substring(begin, end).trim());
          }
          begin = ++end;
        }
      }
      // add last word of input string to list as long as it is not a comma or space
      // duplicate code - plan to fold into if statement inside for loop
      if (theKeyword.substring(begin, end).trim().length > 1) {
        list.push(theKeyword.substring(begin, end).trim());
      }

      let theCity: string;
      let theState: string;

      if (list.length < 2) { // only city name entered
        this.handleSearch(list[0]);
      } else if (list.length < 3) { // parse if input is [city, state] or [city, country]
        theCity = list[0];
        if (this.dataService.isTwoLetterAbbreviation(list[1])) {
          theState = list[1];
          this.handleSearch(theCity + ',' + theState + ',' + 'US');
        } else {
          this.handleSearch(theCity + ',' + list[1]);
        }
      } else { // assume input it [city, state, country]
        this.handleSearch(list[0] + ',' + list[1] + ',' + list[2]);
      }
    }
  }

  // search for weather by zip code (USA only)
  handleZipSearch(theZipCode: string) {
    this.handleSearch(theZipCode + ',US');
  }

  handleSearch(value: string) {
    this.isLoaded = false;
    this.status = '';
    let latitude: string = "", longitude: string = "", city: string = "", state: string = "", country: string = "";

    try {
      this.weatherService.getCoordinates(value).subscribe(
        data => {
          if (data[0] == undefined) {
            this.displayNotFound('undefined data', value);
          } else {
            latitude = data[0].lat;
            longitude = data[0].lon;
            city = data[0].name;
            country = data[0].country;
            if (data[0].state != undefined) {
              if (this.dataService.isUSState(data[0].state)) { // insure that getTwoLetterAbbreviation will return a value
                state = this.dataService.getTwoLetterAbbreviation(data[0].state);
              } else state = "false";

            }

            console.log(latitude + ", " + longitude + " " + city + "," + state + " " + country);
            this.getOneCallWeather(latitude, longitude, city, state, country);
          }
        },
        error => {
          this.displayNotFound(error, value);
        }
      );
    } catch (error: any) {
      console.log(error)
      this.displayNotFound(error, value);
    };
  }

  // not currently implemented
  populateFields(tempDate: Date) {

  }

  // return formatted string of local time
  getLocalTime() {
    let localDate = new Date();
    return this.weatherService.getFormattedTime(localDate) + " " + localDate.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4);
  }

  // send icon code to WeatherService to determine background based on weather conditions
  newMessage(iconCode: string) {
    this.themeService.changeMessage(iconCode);
  }

  //
  triggerBackgroundAnimation() {
    this.themeService.triggerAnimation();
  }

  // currently only works for Latin based languages
  isLetter(char: string) {
    return this.alphabetRegex.test(char);
  }

  // flag to help with async
  display() {
    this.isLoaded = true;
    this.status = 'active';
  }

  displayNotFound(error: any, value: string) {
    console.log('error in weather display');
    console.log(error);
    this.router.navigateByUrl(`404/${value}`);
  }


  //deprecated

  // getWeather(latitude: string, longitude: string) {
  //   var tempDate: Date = new Date();
  //   this.weatherService.getWeather(latitude, longitude).subscribe(
  //     data => {

  //       // create new Weather object based on data recieved from Open Weather API
  //       this.theWeather = new Weather();

  //       // populate theWeather fields -> potential to move into separate method
  //       this.theWeather.theDate = new Date(Date.now() + ((tempDate.getTimezoneOffset() * 60000) + (data.timezone * 1000)));
  //       this.theWeather.theTime = this.weatherService.getFormattedTime(this.theWeather.theDate);
  //       this.theWeather.theFormattedDateString = this.weatherService.getFormattedDate(this.theWeather.theDate);
  //       this.theWeather.theCity = data.name;
  //       this.theWeather.theState = data.sys.state;
  //       this.theWeather.theCountry = data.sys.country;
  //       this.theWeather.theCurrentTemperature = Math.round(data.main.temp);
  //       this.theWeather.theHighTemperature = Math.round(data.main.temp_max);
  //       this.theWeather.theLowTemperature = Math.round(data.main.temp_min);
  //       this.theWeather.theFeelsLike = Math.round(data.main.feels_like);
  //       this.theWeather.theHumidity = Math.round(data.main.humidity);
  //       this.theWeather.theSunrise = this.weatherService.getFormattedUTC(data.timezone, data.sys.sunrise);
  //       this.theWeather.theSunset = this.weatherService.getFormattedUTC(data.timezone, data.sys.sunset);
  //       this.theWeather.theDescription = data.weather[0].description;
  //       this.theWeather.theMainWeather = data.weather[0].main;
  //       this.theWeather.theWindSpeed = data.wind.speed;
  //       this.theWeather.theIcon = data.weather[0].icon;
  //       this.theWeather.theIconPath = this.theWeather.theIconPath + this.theWeather.theIcon + '.png';

  //       this.newMessage(this.theWeather.theIcon + "/");
  //       this.triggerBackgroundAnimation();

  //       // console.log(this.theWeather.theDate);
  //       // console.log(this.theWeather.theTime);
  //       // console.log(this.theWeather.theFormattedDateString);
  //       // console.log(this.theWeather.theCity);
  //       // console.log(this.theWeather.theState);
  //       // console.log(this.theWeather.theCountry);
  //       // console.log(this.theWeather.theCurrentTemperature);
  //       // console.log(this.theWeather.theSunrise);
  //       // console.log(this.theWeather.theSunset);
  //       // console.log(this.theWeather.theDescription);
  //       // console.log(this.theWeather.theMainWeather);
  //       // console.log(this.theWeather.theWindSpeed);
  //       // console.log(this.theWeather.theIcon);
  //       // console.log(this.theWeather.theIconPath);

  //       // console.log(this.theWeather);

  //       // call flag method
  //       this.display();
  //     });
  // }

  getOneCallWeather(latitude: string, longitude: string, city: string, state: string, country: string) {
    var tempDate: Date = new Date();
    this.weatherService.getOneCallWeather(latitude, longitude).subscribe(
      data => {
        this.theWeather = new Weather();

        this.theWeather.theDate = new Date(Date.now() +
          ((tempDate.getTimezoneOffset() * 60000) + (data.timezone_offset * 1000)));
        this.theWeather.theTime = this.weatherService.getFormattedTime(this.theWeather.theDate);
        this.theWeather.theFormattedDateString = this.weatherService.getFormattedDate(this.theWeather.theDate);
        this.theWeather.theCity = city;
        this.theWeather.theState = state === "false" ? "" : state;
        this.theWeather.theCountry = country;

        this.populateF(data);
        this.populateC(data);

        console.log(this.theWeather.F);
        console.log(this.theWeather.C);

        this.theWeather.theCurrentTemperature = Math.round(data.current.temp);
        this.theWeather.theHighTemperature = Math.round(data.daily[0].temp.max);
        this.theWeather.theLowTemperature = Math.round(data.daily[0].temp.min);
        this.theWeather.theFeelsLike = Math.round(data.current.feels_like);
        this.theWeather.theWindSpeed = data.current.wind_speed;

        this.theWeather.theHumidity = Math.round(data.current.humidity);
        this.theWeather.theSunrise = this.weatherService.getFormattedUTC(data.timezone_offset, data.current.sunrise);
        this.theWeather.theSunset = this.weatherService.getFormattedUTC(data.timezone_offset, data.current.sunset);
        this.theWeather.theWindSpeed = data.current.wind_speed;
        this.theWeather.theDescription = data.current.weather[0].description;
        this.theWeather.theMainWeather = data.current.weather[0].main;
        this.theWeather.theIcon = data.current.weather[0].icon;
        this.theWeather.theIconPath = this.theWeather.theIconPath + this.theWeather.theIcon + '.png';

        this.theWeather.theForecasts = [];

        for (let i = 1; i < data.daily.length; i++) {
          let forecast: any = {
            day: this.weatherService.getDayString((this.theWeather.theDate.getDay() + i) % 7),
            icon: this.theIconPath + data.daily[i].weather[0].icon + '.png',
            F: {
              high: this.theUnits === 'F' ? Math.round(data.daily[i].temp.max) : this.convertCelsiusToFarenheit(data.daily[i].temp.max),
              low: this.theUnits === 'F' ? Math.round(data.daily[i].temp.max) : this.convertCelsiusToFarenheit(data.daily[i].temp.min),
            },
            C: {
              high: this.theUnits === 'C' ? data.daily[i].temp.max : this.convertFarenheitToCelsius(data.daily[i].temp.max),
              low: this.theUnits === 'C' ? data.daily[i].temp.min : this.convertFarenheitToCelsius(data.daily[i].temp.min)
            }
          };
          this.theWeather.theForecasts.push(forecast);
        }

        // debugging / testing
        // for(var entry of this.theWeather.theForecasts) {
        //   console.log(entry.day);
        //   console.log(entry.icon);
        //   console.log(entry.high);
        //   console.log(entry.low);
        // }

        this.newMessage(this.theWeather.theIcon + "/");
        this.triggerBackgroundAnimation();

        // console.log(this.theWeather.theDate);
        // console.log(this.theWeather.theTime);
        // console.log(this.theWeather.theFormattedDateString);
        // console.log(this.theWeather.theCity);
        // console.log(this.theWeather.theState);
        // console.log(this.theWeather.theCountry);
        // console.log(this.theWeather.theCurrentTemperature);
        // console.log(this.theWeather.theSunrise);
        // console.log(this.theWeather.theSunset);
        // console.log(this.theWeather.theDescription);
        // console.log(this.theWeather.theMainWeather);
        // console.log(this.theWeather.theWindSpeed);
        // console.log(this.theWeather.theIcon);
        // console.log(this.theWeather.theIconPath);

        // console.log(this.theWeather);

        // call flag method
        this.display();
      }
    );
  }

  populateF(data: any) {
    if (this.theUnits === 'F') {
      this.theWeather.F.theCurrentTemperature = Math.round(data.current.temp);
      this.theWeather.F.theHighTemperature = Math.round(data.daily[0].temp.max);
      this.theWeather.F.theLowTemperature = Math.round(data.daily[0].temp.min);
      this.theWeather.F.theFeelsLike = Math.round(data.current.feels_like);
      this.theWeather.F.theWindSpeed = data.current.wind_speed + 'mph';
    } else {
      this.theWeather.F.theCurrentTemperature = this.convertCelsiusToFarenheit(data.current.temp);
      this.theWeather.F.theHighTemperature = this.convertCelsiusToFarenheit(data.daily[0].temp.max);
      this.theWeather.F.theLowTemperature = this.convertCelsiusToFarenheit(data.daily[0].temp.min);
      this.theWeather.F.theFeelsLike = this.convertCelsiusToFarenheit(data.current.feels_like);
      this.theWeather.F.theWindSpeed = this.convertKphToMph(data.current.wind_speed) + 'mph';
    }
  }

  populateC(data: any) {
    if (this.theUnits === 'C') {
      this.theWeather.C.theCurrentTemperature = Math.round(data.current.temp);
      this.theWeather.C.theHighTemperature = Math.round(data.daily[0].temp.max);
      this.theWeather.C.theLowTemperature = Math.round(data.daily[0].temp.min);
      this.theWeather.C.theFeelsLike = Math.round(data.current.feels_like);
      this.theWeather.C.theWindSpeed = data.current.wind_speed + 'kph';
    } else {
      this.theWeather.C.theCurrentTemperature = this.convertFarenheitToCelsius(data.current.temp);
      this.theWeather.C.theHighTemperature = this.convertFarenheitToCelsius(data.daily[0].temp.max);
      this.theWeather.C.theLowTemperature = this.convertFarenheitToCelsius(data.daily[0].temp.min);
      this.theWeather.C.theFeelsLike = this.convertFarenheitToCelsius(data.current.feels_like);
      this.theWeather.C.theWindSpeed = this.convertMphToKph(data.current.wind_speed) + 'kph';
    }

  }

  convertFarenheitToCelsius(temp: number) {
    return Math.round((temp - 32) * 5/9);
  }

  convertCelsiusToFarenheit(temp: number) {
    return Math.round((temp * 9/5) + 32);
  }

  convertMphToKph(speed: number) {
    return Math.round(speed * 1.609);
  }

  convertKphToMph(speed: number) {
    return Math.round(speed / 1.609);
  }

}

interface Numbers {
  F?: any,
  C?: any;
}
