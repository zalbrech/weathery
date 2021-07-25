import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
// import { Console } from 'console';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
  }

  getLondonWeather() {
    // console.log(this.weatherService.getCityWeather('London'));
    this.weatherService.getCityWeather('London');
    // const theTime = new Date(t * 1000).toISOString().substr(11,8);
    // const theTime = new Date().setUTCSeconds;
    // console.log('The time is ' + theTime);
    
  }

  getNewYorkWeather() {
    // console.log(this.weatherService.getCityWeather('London'));
    this.weatherService.getCityWeather('New York');
  }

  




}
