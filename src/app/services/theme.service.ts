import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';

export interface ThemeObject {
  oldValue: any;
  newValue: any;
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private backgrounds:string[] = [];
  myPath: string = "assets/images/";

  private messageSource;
  currentMessage;

  private myMethodSubject = new Subject<any>();

  constructor() {
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-clouds.jpg", "dark-mountains.jpg", "fog-forest.jpg", "rain-window.jpg", "snow-field.jpg", "sunny-field.jpg"];
    this.messageSource = new BehaviorSubject<string>(this.myPath + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)]);
    this.currentMessage = this.messageSource.asObservable();
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}

