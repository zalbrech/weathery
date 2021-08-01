import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router,
              private weatherService: WeatherService) { }

  ngOnInit(): void {
  }

  doSearch(value: string) {
    console.log(`value=${value}`);
    this.weatherService.getCityWeather(value);
  }
}
