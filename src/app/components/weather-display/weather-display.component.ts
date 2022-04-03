import { isFormattedError } from '@angular/compiler';
import { Component, ComponentFactoryResolver, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Weather } from 'src/app/classes/weather';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';
import { WeatherService } from 'src/app/services/weather.service';
import { BackgroundComponent } from '../background/background.component';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {

  isLoaded = false;
  theTemperatureFarenheit: number = 0;
  private backgrounds: string[];

  message: string = "";

  numRegex = new RegExp(/\d/g);
  zipRegex = new RegExp((/(^\d{5}$)|(^\d{5}-\d{4}$)/));
  delimiterRegex = new RegExp('[\s,]');

  constructor(private weatherService: WeatherService,
    private route: ActivatedRoute,
    private router: Router,
    public theWeather: Weather,
    private backgroundComponent: BackgroundComponent,
    public themeService: ThemeService,
    public dataService: DataService
  ) {
    // this.weatherService.theWeather.subscribe();
    // console.log('***********************\nin WeatherDisplay constructor\n');
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-clouds.jpg", "dark-mountains.jpg", "fog-forest.jpg", "rain-window.jpg", "snow-field.jpg"];
  }

  ngOnInit(): void {
    // console.log('***********************\nin WeatherDisplay OnInit\n');
    this.getLocalTime();
    this.route.paramMap.subscribe(() => {
      this.getWeather();
    });


    this.themeService.currentMessage.subscribe(message => this.message = message);
  }

  getWeather() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

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

      // test for incorrectly entered non=letters at beginning of string
      // this method currently only works for Latin based languages
      while (!this.isLetter(theKeyword.charAt(begin))) {
        begin++;
      }

      let list = new Array();

      for (end = begin; end < theKeyword.length; end++) {
        if (theKeyword.charAt(end) == ',') {
          console.log('delimiter found');
          if(theKeyword.substring(begin,end).length > 1) {
            list.push(theKeyword.substring(begin,end).trim());
          }
          begin = ++end;
        }
      }
      // add last word of input string to list as long as it is not a comma or space
      // duplicate code - plan to fold into if statement inside for loop
      if (!this.delimiterRegex.test(theKeyword.substring(begin,end))) {
        list.push(theKeyword.substring(begin,end).trim());
      }

      for(let i = 0; i < list.length; i++) {
        console.log(list[i]);
      }

      let theCity: string;
      let theState: string;
      let theCountry: string;

      // only city name entered
      if(list.length < 2) {
        this.handleSearch(theKeyword);
      } else if (list.length < 3) {
        theCity = list[0];
        if(this.dataService.isUSState(list[1])) {
          console.log(list[1] + ' is a US state');
          theState = list[1];
          this.handleSearch(theCity + ',' + theState + ',' + 'US');
        } else {
          this.handleSearch(theCity + ',' + list[1]);
        }
      } else {
        this.handleSearch(list[0] + ',' + list[1] + ',' + list[2]);
      }

      // parse input
      // if (theKeyword.includes(",")) {
      //   const theTrimmedKeyword = theKeyword.replace(/\s/g, "");
      //   console.log(theTrimmedKeyword);
      //   let arr: string[] = theTrimmedKeyword.split(",");


      //   let theCity;
      //   let theState;
      //   let theCountry;

      //   // city weather
      //   if (arr.length < 2) {
      //     theCity = arr[0];
      //     this.handleCitySearch(theCity);
      //   }

      //   if (arr.length < 3) {
      //     theCity = arr[0];
      //   }
      // }

      // this.handleSearch(theKeyword);
    }
    // console.log(`theKeyword=${theKeyword}`);


  }

  handleCitySearch(theCity: string) {

  }

  handleCityCountrySearch(theCity: string, theCountry: string) {

  }

  handleCityStateSearch(theCity: string, theState: string) {

  }

  handleCityStateCountrySearch(theCity: string, theState: string, theCountry: string) {

  }

  handleZipSearch(theZipCode: string) {
    this.handleSearch(theZipCode + ',US');
  }

  handleSearch(value: string) {

    // console.log('handleSearch() method');
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
        this.theWeather.theSunrise = this.weatherService.getFormattedUTC(data.timezone, data.sys.sunrise);
        this.theWeather.theSunset = this.weatherService.getFormattedUTC(data.timezone, data.sys.sunset);
        this.theWeather.theDescription = data.weather[0].description;
        this.theWeather.theMainWeather = data.weather[0].main;
        this.theWeather.theWindSpeed = data.wind.speed;
        this.theWeather.theIcon = data.weather[0].icon;
        this.theWeather.theIconPath = this.theWeather.theIconPath + this.theWeather.theIcon + '.png';
        // this.theWeather.theBackground = this.setBackground();


        this.newMessage();

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

        this.isLoaded = true;
      }
    )

  }

  populateFields(tempDate: Date,) {

  }

  getLocalTime() {
    let localDate = new Date();
    return this.weatherService.getFormattedTime(localDate) + " " + localDate.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4);
  }

  newMessage() {
    let basePath: string = "assets/images/";
    var index: number = Math.floor(Math.random() * this.backgrounds.length);
    this.themeService.changeMessage(basePath + this.backgrounds[index]);
  }

  // currently only works for Latin based languages
  isLetter(char: string) {
    return char.toUpperCase() != char.toLowerCase();
  }
}
