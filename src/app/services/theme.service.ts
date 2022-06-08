import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeObject {
  oldValue: any;
  newValue: any;
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private backgrounds:string[] = [];
  // private _01d :string[] = [];
  // private _01n: string[] = [];
  // private _02d: string[] = [];
  // private _02n: string[] = [];
  // private _03d: string[] = [];
  // private _03n: string[] = [];
  // private _04d: string[] = [];
  // private _04n: string[] = [];
  // private _09d: string[] = [];
  // private _10d: string[] = [];
  // private _10n: string[] = [];
  // private _11d: string[] = [];
  // private _13d: string[] = [];
  // private _13n: string[] = [];
  // private _50d: string[] = [];
  // private _50n: string[] = [];
  myPath: string = "assets/images/backgrounds/";

  private messageSource;
  currentMessage;

  // private myMethodSubject = new Subject<any>();

  constructor() {
    this.backgrounds = ["blue-mountains.jpg", "clear-sky.jpg", "dark-mountains.jpg"];
    this.messageSource = new BehaviorSubject<string>("assets/images/" + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)]);
    this.currentMessage = this.messageSource.asObservable();
    console.log('in theme service');
  }

  changeMessage(message:string) {
    console.log(message);
    this.messageSource.next(message);
  }
}

