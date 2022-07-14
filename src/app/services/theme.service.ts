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
  private myPath: string = "assets/images/backgrounds/";
  private backgroundSource;
  private animationSource;
  private animationValue = true;
  private oldIndex: number;
  private extension: string;

  backgroundMessage;
  animationMessage;

  constructor() {
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-mountains.jpg"];
    this.backgroundSource = new BehaviorSubject<string>("assets/images/" + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)]);
    this.backgroundMessage = this.backgroundSource.asObservable();

    this.animationSource = new BehaviorSubject<boolean>(this.animationValue);
    this.animationMessage = this.animationSource.asObservable();
    this.oldIndex = 0;
    this.extension = ".jpg";
  }

  // send path to BackgroundComponent to display background image based on current location's weather conditions
  changeBackgroundMessage(iconCode:string) {
    let index: number = Math.floor(Math.random() * 3);
    if (index === this.oldIndex) { // prevent duplicate backgrounds
      console.log('preventing duplicate. index = ' + index + ' and oldIndex = ' + this.oldIndex);
      index = (index + 1) % 3;
      console.log('index is now ' + index);
    }
    this.oldIndex = index;
    this.backgroundSource.next(this.myPath + iconCode + index + this.extension);
    
  }

  // trigger fade animation in BackgroundComponent
  triggerAnimation() { 
    this.animationValue = !this.animationValue
    this.animationSource.next(this.animationValue);
  }

}

