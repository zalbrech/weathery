import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  dropdownOpen = false;
  theUnits = 'IMPERIAL'
  private unitSource;
  unitMessage;
  constructor(private weatherService: WeatherService) { 
    console.log('in header constructor');
    this.unitSource = new BehaviorSubject<string>(this.theUnits); 
    this.unitMessage = this.unitSource.asObservable();
  }

  ngOnInit(): void {
  }
  
  setImperial() {
    if(this.theUnits === 'IMPERIAL') return;
    this.theUnits = 'IMPERIAL';
    this.weatherService.setUnits(this.theUnits);
    // console.log("theUnits are " + this.theUnits);
  }

  setMetric() {
    if(this.theUnits === 'METRIC') return;
    this.theUnits = 'METRIC';
    this.weatherService.setUnits(this.theUnits);
    // console.log('theUnits are ' + this.theUnits);
  }
}
