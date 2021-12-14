import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
 } from '@angular/animations';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css'],
  animations: [
    // animations go here
  ]
})
export class BackgroundComponent implements OnInit {

  isLoaded = false;

  // private backgrounds: string[];
  value: string = "";
  myPath: string = "assets/images/";

  message:string = "";


  constructor(public themeService: ThemeService) {
    // this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-clouds.jpg", "dark-mountains.jpg", "fog-forest.jpg", "rain-window.jpg", "snow-field.jpg", "sunny-field.jpg"];
    // this.message = this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    // console.log("BACKGROUND CONSTRUCTOR");

  }

  ngOnInit(): void {
    // this.setBackground();
    this.isLoaded = false;
    this.themeService.currentMessage.subscribe(message => this.message = message);
    this.isLoaded =  true;

  }

  // changeBackground(theBackground: string) {
  //   console.log('the current background is ' + this.value);
  //   console.log('the new background will be ' + theBackground);
  //   this.value = theBackground;

  //   return this.value;
  // }

  // setBackground() {
  //   this.isLoaded = false;
  //   console.log("BACKGROUND setBackground()");
  //   this.value = this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
  //   console.log('the new value is ' + this.value);
  //   this.isLoaded = true;

  // }

  // getBackground() {
  //   return this.value;
  // }

  // setValue(newValue: string) {
  //   this.value = newValue;
  // }

}
