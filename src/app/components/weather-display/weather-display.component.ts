import { Component, ComponentFactoryResolver, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Weather } from 'src/app/classes/weather';
// import { Console } from 'console';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {


  theTemperatureFarenheit: number = 0;
  constructor(private weatherService: WeatherService,
              private route: ActivatedRoute,
              public theWeather: Weather
              ) {
                // this.weatherService.theWeather.subscribe();
                console.log('***********************\nin WeatherDisplay constructor\n');
                
               }

  ngOnInit(): void {
    console.log('***********************\nin WeatherDisplay OnInit\n');
    this.route.paramMap.subscribe(() => {
      this.getWeather();
    });
  }

  getWeather() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    console.log(`theKeyword=${theKeyword}`);
    this.handleSearch(theKeyword);

  }
  handleSearch(value: string) {

    // console.log('route snapshopt = ' + this.route.snapshot.paramMap.get('keyword'));
    console.log('handleSearch() method');
    var tempDate: Date = new Date();

    this.weatherService.getCityWeather(value).subscribe(
      data => {
        // TODO: refactor date/time methods and call inside weather-display component
        this.theWeather = new Weather();
        // localDate.getTimezoneOffset() * 60000) + (this.theTimezone * 1000
        // this.theDate = new Date(Date.now() + theOffsetMilli);

        this.theWeather.theDate = new Date(Date.now() + ((tempDate.getTimezoneOffset() * 60000) + (data.timezone * 1000)));
        this.theWeather.theTime = this.weatherService.getFormattedTime(this.theWeather.theDate);
        this.theWeather.theFormattedDateString = this.weatherService.getFormattedDate(this.theWeather.theDate);
        this.theWeather.theCity = data.name;
        this.theWeather.theCountry = data.sys.country;
        


       
        console.log(this.theWeather.theCity);
        console.log(this.theWeather.theCountry);
        console.log(this.theWeather.theDate);
        console.log(this.theWeather.theTime);
        console.log(this.theWeather.theFormattedDateString);

      }
    )
    // this.weatherService.getCityWeather(value);
    // this.weatherService.theWeather.subscribe(data => {
    //   this.theTemperatureFarenheit = data.theTemperatureFarenheit;
      
    // });

    
    
    // console.log('in weather-display handleSearch => ' + this.theTemperatureFarenheit);
    // console.log(this.theWeather);
    
  }

  

}
