import { Component, ComponentFactoryResolver, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Weather } from 'src/app/classes/weather';
// import { Console } from 'console';
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

  constructor(private weatherService: WeatherService,
    private route: ActivatedRoute,
    private router: Router,
    public theWeather: Weather,
    private backgroundComponent: BackgroundComponent
  ) {
    // this.weatherService.theWeather.subscribe();
    console.log('***********************\nin WeatherDisplay constructor\n');
  }

  ngOnInit(): void {
    console.log('***********************\nin WeatherDisplay OnInit\n');
    this.route.paramMap.subscribe(() => {
      this.getWeather();
    });

    this.getLocalTime();
  }

  getWeather() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    console.log(`theKeyword=${theKeyword}`);
    this.handleSearch(theKeyword);

  }
  handleSearch(value: string) {

    // console.log('route snapshopt = ' + this.route.snapshot.paramMap.get('keyword'));
    console.log('handleSearch() method');
    // this.backgroundComponent.ngOnInit();
    this.backgroundComponent.changeBackground();
    var tempDate: Date = new Date();

    this.weatherService.getCityWeather(value).subscribe(
      data => {
        this.theWeather = new Weather();
        // localDate.getTimezoneOffset() * 60000) + (this.theTimezone * 1000
        // this.theDate = new Date(Date.now() + theOffsetMilli);

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

        this.isLoaded = true;

        console.log(this.theWeather.theDate);
        console.log(this.theWeather.theTime);
        console.log(this.theWeather.theFormattedDateString);
        console.log(this.theWeather.theCity);
        console.log(this.theWeather.theState);
        console.log(this.theWeather.theCountry);
        console.log(this.theWeather.theCurrentTemperature);
        console.log(this.theWeather.theSunrise);
        console.log(this.theWeather.theSunset);
        console.log(this.theWeather.theDescription);
        console.log(this.theWeather.theMainWeather);
        console.log(this.theWeather.theWindSpeed);
        console.log(this.theWeather.theIcon);
        console.log(this.theWeather.theIconPath);

        console.log(this.theWeather);
      }
    )

  }

  getLocalTime() {
    let localDate = new Date();
    console.log("THE LOCAL DATE IS " + localDate);
    return this.weatherService.getFormattedTime(localDate) + " " + localDate.toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'long' }).substring(4);
  }
}
