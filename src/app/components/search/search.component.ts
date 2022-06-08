import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from 'src/app/services/weather.service';
import { WeatherDisplayComponent } from '../weather-display/weather-display.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private weatherDisplay: WeatherDisplayComponent) {}
  
  ngOnInit(): void {}

  doSearch(value: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl(`/weather-display/${value}`));
  }
}
