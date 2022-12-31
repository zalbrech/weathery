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
        style({ transform: 'translateY(200%)' ,opacity: '0'},),
        animate('1.3s .85s ease-in-out', style({ transform: 'translateY(0%)' , opacity: '1'}))
      ])
    ])
  ]
})

export class WeatherDisplayComponent implements OnInit {

  isLoaded: boolean;
  backgroundMessage: string;
  status: string;
  theIconPath: string;
  theUnits: string;
  isZip: boolean;

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
    this.backgroundMessage = "";
    this.status = "";
    this.theIconPath = "assets/images/weather-icons/";
    this.theUnits = "";
    this.isZip = false;

    //Regex
    this.numRegex = new RegExp(/\d/g);
    this.zipRegex = new RegExp((/(^\d{5}$)|(^\d{5}-\d{4}$)/));
    this.delimiterRegex = new RegExp('[\s,]');
    this.alphabetRegex = new RegExp('[a-zA-Z]');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.parseInput();
    });

    this.themeService.backgroundMessage.subscribe(message => this.backgroundMessage = message);
    this.weatherService.unitMessage.subscribe(units => this.theUnits = units);
  }

  // return formatted string of local time
  getLocalTime() {
    let localDate = new Date();
    return this.weatherService.getFormattedTime(localDate) + " " + localDate.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4);
  }

  // ** private methods **

  private parseInput() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')?.toUpperCase()!;

    // check response code
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
        console.log('invalid zip');
        this.router.navigateByUrl(`404/${theKeyword}`);
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
      } else { // assume input is [city, state, country]
        this.handleSearch(list[0] + ',' + list[1] + ',' + list[2]);
      }
    }
  }

  // search for weather by zip code (USA only)
  // duplicate method needed due to using Google Maps Geocoding API
  // OpenWeather Geocoding API does not return a state for the given location
  private handleZipSearch(theZipCode: string) {
    this.isLoaded = false;
    this.status = '';

    let latitude: string = "", longitude: string = "", city: string = "", state: string = "", country: string = "";
    try {
      this.weatherService.getZipCoordinates(theZipCode).subscribe(
        data => {
          if (data === undefined) {
            this.displayNotFound('undefined data', theZipCode);
          } else {
            latitude = data.results[0].geometry.location.lat;
            longitude = data.results[0].geometry.location.lng;
            city = data.results[0].address_components[1].long_name;
            state = data.results[0].address_components[3].short_name;
            country = 'US';
          }
          this.getOneCallWeather(latitude, longitude, city, state, country);

        },
        error => {
          this.displayNotFound(error, theZipCode);
        }
      );
    } catch (error: any) {
      this.displayNotFound(error, theZipCode);
    };
  }

  // use OpenWeather Geocode API to retrieve longitude and latitude from input search string,
  // then call the OpenWeather OneCall API
  private handleSearch(value: string) {
    this.isLoaded = false;
    this.status = '';
    let latitude: string = "", longitude: string = "", city: string = "", state: string = "", country: string = "";

    try {
      this.weatherService.getCoordinates(value).subscribe(
        data => {
          if (data[0] === undefined) {
            this.displayNotFound('undefined data', value);
          } else {
            latitude = data[0].lat;
            longitude = data[0].lon;
            city = data[0].name;
            country = data[0].country;
            if (data[0].state != undefined) {
              if (this.dataService.isUSState(data[0].state)) { // ensure that getTwoLetterAbbreviation will return a value
                state = this.dataService.getTwoLetterAbbreviation(data[0].state);
              } else state = "false";

            }

            this.getOneCallWeather(latitude, longitude, city, state, country);
          }
        },
        error => {
          this.displayNotFound(error, value);
        }
      );
    } catch (error: any) {
      this.displayNotFound(error, value);
    };
  }

  // send icon code to WeatherService to determine background based on weather conditions
  private newBackgroundMessage(iconCode: string) {
    this.themeService.changeBackgroundMessage(iconCode);
  }

  //
  private triggerBackgroundAnimation() {
    this.themeService.triggerAnimation();
  }

  // currently only works for Latin based languages
  private isLetter(char: string) {
    return this.alphabetRegex.test(char);
  }

  // flag to help with async
  private display() {
    this.isLoaded = true;
    this.status = 'active';
  }

  private displayNotFound(error: any, value: string) {
    console.log('error in weather display');
    console.log(error);
    this.router.navigateByUrl(`404/${value}`);
  }

  // populate Weather object with values from OpenWeather OneCall API
  private getOneCallWeather(latitude: string, longitude: string, city: string, state: string, country: string) {
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

        // populate Imperial and Metric units
        this.populateF(data);
        this.populateC(data);

        this.theWeather.theHumidity = Math.round(data.current.humidity);
        this.theWeather.theSunrise = this.weatherService.getFormattedUTC(data.timezone_offset, data.current.sunrise);
        this.theWeather.theSunset = this.weatherService.getFormattedUTC(data.timezone_offset, data.current.sunset);
        this.theWeather.theWindSpeed = data.current.wind_speed;
        this.theWeather.theDescription = data.current.weather[0].description;
        this.theWeather.theMainWeather = data.current.weather[0].main;
        this.theWeather.theIcon = data.current.weather[0].icon;
        this.theWeather.theIconPath = this.theWeather.theIconPath + this.theWeather.theIcon + '.png';

        this.theWeather.theForecasts = [];

        // populate forecast array
        for (let i = 1; i < data.daily.length; i++) {
          let forecast: any = {
            day: this.weatherService.getDayString((this.theWeather.theDate.getDay() + i) % 7),
            icon: this.theIconPath + data.daily[i].weather[0].icon + '.png',
            F: {
              high: this.theUnits === 'F' ? Math.round(data.daily[i].temp.max) : this.convertCelsiusToFarenheit(data.daily[i].temp.max),
              low: this.theUnits === 'F' ? Math.round(data.daily[i].temp.min) : this.convertCelsiusToFarenheit(data.daily[i].temp.min),
            },
            C: {
              high: this.theUnits === 'C' ? data.daily[i].temp.max : this.convertFarenheitToCelsius(data.daily[i].temp.max),
              low: this.theUnits === 'C' ? data.daily[i].temp.min : this.convertFarenheitToCelsius(data.daily[i].temp.min)
            }
          };
          this.theWeather.theForecasts.push(forecast);
        }

        // update message passed to BackgroundComponent
        this.newBackgroundMessage(this.theWeather.theIcon + "/");

        // trigger backgroundComponent animation
        this.triggerBackgroundAnimation();

        // call flag method
        this.display();
      }
    );
  }

  // populate Imperial units
  private populateF(data: any) {
    if (this.theUnits === 'F') {
      this.theWeather.F.theCurrentTemperature = Math.round(data.current.temp);
      this.theWeather.F.theHighTemperature = Math.round(data.daily[0].temp.max);
      this.theWeather.F.theLowTemperature = Math.round(data.daily[0].temp.min);
      this.theWeather.F.theFeelsLike = Math.round(data.current.feels_like);
      this.theWeather.F.theWindSpeed = Math.round(data.current.wind_speed) + 'mph';
    } else {
      this.theWeather.F.theCurrentTemperature = this.convertCelsiusToFarenheit(data.current.temp);
      this.theWeather.F.theHighTemperature = this.convertCelsiusToFarenheit(data.daily[0].temp.max);
      this.theWeather.F.theLowTemperature = this.convertCelsiusToFarenheit(data.daily[0].temp.min);
      this.theWeather.F.theFeelsLike = this.convertCelsiusToFarenheit(data.current.feels_like);
      this.theWeather.F.theWindSpeed = this.convertKphToMph(data.current.wind_speed) + 'mph';
    }
  }

  // populate Metric units
  private populateC(data: any) {
    if (this.theUnits === 'C') {
      this.theWeather.C.theCurrentTemperature = Math.round(data.current.temp);
      this.theWeather.C.theHighTemperature = Math.round(data.daily[0].temp.max);
      this.theWeather.C.theLowTemperature = Math.round(data.daily[0].temp.min);
      this.theWeather.C.theFeelsLike = Math.round(data.current.feels_like);
      this.theWeather.C.theWindSpeed = Math.round(data.current.wind_speed) + 'kph';
    } else {
      this.theWeather.C.theCurrentTemperature = this.convertFarenheitToCelsius(data.current.temp);
      this.theWeather.C.theHighTemperature = this.convertFarenheitToCelsius(data.daily[0].temp.max);
      this.theWeather.C.theLowTemperature = this.convertFarenheitToCelsius(data.daily[0].temp.min);
      this.theWeather.C.theFeelsLike = this.convertFarenheitToCelsius(data.current.feels_like);
      this.theWeather.C.theWindSpeed = this.convertMphToKph(data.current.wind_speed) + 'kph';
    }
  }

  private convertFarenheitToCelsius(temp: number) {
    return Math.round((temp - 32) * 5 / 9);
  }

  private convertCelsiusToFarenheit(temp: number) {
    return Math.round((temp * 9 / 5) + 32);
  }

  private convertMphToKph(speed: number) {
    return Math.round(speed * 1.609);
  }

  private convertKphToMph(speed: number) {
    return Math.round(speed / 1.609);
  }
}
