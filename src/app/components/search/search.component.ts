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

  constructor(private router: Router, private route: ActivatedRoute, private weatherDisplay: WeatherDisplayComponent) {
    // console.log('in SEARCH constructor');
   }

  ngOnInit(): void { 
    // console.log('in SEARCH onInit()');

  }

  doSearch(value: string) {
    // console.log(' !!!! All searches after first search start here !!!!');
    console.log('in SEARCH doSearch()');
    // console.log('current value=' + this.router.url);
    // console.log(this.route.snapshot);
    // console.log(`new value=/weather-display/${value}`);

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl(`/weather-display/${value}`));
  }
}
