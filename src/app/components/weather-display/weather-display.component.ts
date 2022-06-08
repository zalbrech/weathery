import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Weather } from 'src/app/classes/weather';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';
import { WeatherService } from 'src/app/services/weather.service';
import { BackgroundComponent } from '../background/background.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
  animations: [
    trigger('fade', [
      transition('void => active', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})

export class WeatherDisplayComponent implements OnInit {

  isLoaded: boolean;
  theTemperatureFarenheit: number;
  basePath: string;
  message: string;
  status: string;
  oldIndex: number = 0;

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
    public dataService: DataService
  ) {
    this.isLoaded = false;
    this.theTemperatureFarenheit = 0;
    this.basePath = "assets/images/backgrounds/";
    this.message = "";
    this.status = "";

    this.numRegex = new RegExp(/\d/g);
    this.zipRegex = new RegExp((/(^\d{5}$)|(^\d{5}-\d{4}$)/));
    this.delimiterRegex = new RegExp('[\s,]');
    this.alphabetRegex = new RegExp('[a-zA-Z]');
  }

  ngOnInit(): void {
    console.log('in WeatherDisplay OnInit');
    this.getLocalTime();
    this.route.paramMap.subscribe(() => {
      this.getWeather();
    });

    this.themeService.currentMessage.subscribe(message => this.message = message);
  }

  getWeather() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')?.toUpperCase()!;

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

      for (end = begin; end < theKeyword.length; end++) {
        if (theKeyword.charAt(end) == ',') {
          console.log('delimiter found');
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

      // for (let i = 0; i < list.length; i++) {
      //   console.log(list[i]);
      // }

      let theCity: string;
      let theState: string;

      // only city name entered
      if (list.length < 2) {
        this.handleSearch(list[0]);
      } else if (list.length < 3) {
        theCity = list[0];
        if (this.dataService.isUSState(list[1])) {
          // console.log(list[1] + ' is a US state');
          theState = list[1];
          this.handleSearch(theCity + ',' + theState + ',' + 'US');
        } else {
          this.handleSearch(theCity + ',' + list[1]);
        }
      } else {
        this.handleSearch(list[0] + ',' + list[1] + ',' + list[2]);
      }
    }
  }

  handleZipSearch(theZipCode: string) {
    this.handleSearch(theZipCode + ',US');
  }

  handleSearch(value: string) {
    // this.backgroundComponent.reset();

    this.isLoaded = false;
    this.status = '';
    var tempDate: Date = new Date();

    this.weatherService.getCityWeather(value).subscribe(
      data => {
        this.theWeather = new Weather();

        this.theWeather.theDate = new Date(Date.now() + ((tempDate.getTimezoneOffset() * 60000) + (data.timezone * 1000)));
        this.theWeather.theTime = this.weatherService.getFormattedTime(this.theWeather.theDate);
        this.theWeather.theFormattedDateString = this.weatherService.getFormattedDate(this.theWeather.theDate);
        this.theWeather.theCity = data.name;
        this.theWeather.theState = data.sys.state;
        this.theWeather.theCountry = data.sys.country;
        this.theWeather.theCurrentTemperature = Math.round(data.main.temp);
        this.theWeather.theHighTemperature = Math.round(data.main.temp_max);
        this.theWeather.theLowTemperature = Math.round(data.main.temp_min);
        this.theWeather.theFeelsLike = Math.round(data.main.feels_like);
        this.theWeather.theHumidity = Math.round(data.main.humidity);
        this.theWeather.theSunrise = this.weatherService.getFormattedUTC(data.timezone, data.sys.sunrise);
        this.theWeather.theSunset = this.weatherService.getFormattedUTC(data.timezone, data.sys.sunset);
        this.theWeather.theDescription = data.weather[0].description;
        this.theWeather.theMainWeather = data.weather[0].main;
        this.theWeather.theWindSpeed = data.wind.speed;
        this.theWeather.theIcon = data.weather[0].icon;
        this.theWeather.theIconPath = this.theWeather.theIconPath + this.theWeather.theIcon + '.png';

        this.newMessage(this.theWeather.theIcon);

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

        this.display();
      }
    )
  }

  populateFields(tempDate: Date) {

  }

  getLocalTime() {
    let localDate = new Date();
    return this.weatherService.getFormattedTime(localDate) + " " + localDate.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4);
  }

  newMessage(value: string) {
    let index: number = Math.floor(Math.random() * 3);
    if(index === this.oldIndex) { // prevent duplicate backgrounds
      console.log('preventing duplicate. index = ' + index + ' and oldIndex = ' + this.oldIndex);
      index = (index+1) % 3;
      console.log('index is now ' + index);
    }
    this.oldIndex = index;
    console.log(this.oldIndex + ' ' + index);
    this.themeService.changeMessage(this.basePath + value + "/" + index + ".jpg");
  }

  // currently only works for Latin based languages
  isLetter(char: string) {
    return this.alphabetRegex.test(char);
  }

  display() {
    this.isLoaded = true;
    this.status = 'active';
  }
}
