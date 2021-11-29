import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  private backgrounds:string[];
  value:string = "";
  myPath:string = "assets/images/";

  constructor() {
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-clouds.jpg", "dark-mountains.jpg", "fog-forest.jpg", "rain-window.jpg", "snow-field.jpg"];
    this.value=this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    console.log("BACKGROUND CONSTRUCTOR");
   }

  ngOnInit(): void {
    console.log("BACKGROUND ngOnInit()");
    this.value=this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    console.log(this.value);

    // this.changeBackground();
  }

  changeBackground() {
    console.log("BACKGROUND changeBackground()")
    var index:number = Math.floor(Math.random() * this.backgrounds.length); 
    this.setValue(this.backgrounds[index]);
    console.log(this.value);
    // this.ngOnInit();
  }

  // setBackground() {
    
  // }

  setValue(newValue:string) {
    this.value = newValue;
  }

}
