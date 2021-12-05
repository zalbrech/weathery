import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  backgroundImageStyle: any;
  backgroundImage: string = "";
  isLoaded = false;
  private backgrounds:string[];
  value:string = "";
  myPath:string = "assets/images/";

  constructor(private sanitizer: DomSanitizer) {
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-clouds.jpg", "dark-mountains.jpg", "fog-forest.jpg", "rain-window.jpg", "snow-field.jpg"];
    this.value=this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    console.log("BACKGROUND CONSTRUCTOR");
   }

  ngOnInit(): void {
    this.isLoaded = false;
    console.log("BACKGROUND ngOnInit()");
    this.value=this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    console.log('the new value is ' + this.value);
    this.isLoaded = true;

    // this.backgroundImageStyle = this.changeBackground();
  }

  changeBackground() {
    console.log("BACKGROUND changeBackground()")
    var index:number = Math.floor(Math.random() * this.backgrounds.length); 
    this.value = (this.backgrounds[index]);
    console.log(this.value);

    this.backgroundImage = this.myPath + this.value;

    const style = `background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${this.backgroundImage})`;

    // return this.sanitizer.bypassSecurityTrustStyle(style);
    // this.ngOnInit();
  }

  // setBackground() {
    
  // }

  getBackground() {
    return this.value;
  }

  setValue(newValue:string) {
    this.value = newValue;
  }

}
