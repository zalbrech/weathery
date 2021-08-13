import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

export interface ThemeObject {
  oldValue: any;
  newValue: any;
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  initialSetting: ThemeObject = {
    oldValue: null,
    newValue: 'bootstrap'
  };

  white: string = "#ffffff";
  black: string = "#141313";

  themeSelection: BehaviorSubject<ThemeObject> = new BehaviorSubject<ThemeObject>(this.initialSetting);
  
  constructor() { }

  setTheme(theme: string) {
    this.themeSelection.next(
      {
        oldValue: this.themeSelection.value.newValue,
        newValue: theme
      });
  }

  themeChanges(): Observable<ThemeObject> {
    return this.themeSelection.asObservable();
  }
}
