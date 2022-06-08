import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeObject {
  oldValue: any;
  newValue: any;
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private backgrounds:string[] = [];
  myPath: string = "assets/images/backgrounds/";

  private messageSource;
  private animationSource;
  private animationValue = true;
  currentMessage;
  animationMessage;
  oldIndex: number;
  extension: string;

  constructor() {
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-mountains.jpg"];
    this.messageSource = new BehaviorSubject<string>("assets/images/" + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)]);
    this.currentMessage = this.messageSource.asObservable();

    this.animationSource = new BehaviorSubject<boolean>(this.animationValue);
    this.animationMessage = this.animationSource.asObservable();
    this.oldIndex = 0;
    this.extension = ".jpg";
  }

  // send path to BackgroundComponent to display background image based on current location's weather conditions
  changeMessage(iconCode:string) {
    let index: number = Math.floor(Math.random() * 3);
    if (index === this.oldIndex) { // prevent duplicate backgrounds
      console.log('preventing duplicate. index = ' + index + ' and oldIndex = ' + this.oldIndex);
      index = (index + 1) % 3;
      console.log('index is now ' + index);
    }
    this.oldIndex = index;
    this.messageSource.next(this.myPath + iconCode + index + this.extension);
    
  }

  triggerAnimation() {
    this.animationValue = !this.animationValue
    this.animationSource.next(this.animationValue);
  }

}

