import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private twoLetterStates:Set<string>;

  //replace twoLetterStates with stateMap, can still use isUSState() method and also display state abbreviation in weather display
  private stateMap:Map<String,String>;
  
  constructor() { 
    this.twoLetterStates = new Set<string>([
      'AL', 'AK', 'AZ', 'AR', 
      'CA', 'CO', 'CT', 'DE', 
      'FL', 'GA', 'HI', 'ID',
      'IL', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS',
      'MO', 'MT', 'NE', 'NV',
      'NH', 'NJ', 'NM', 'NY',
      'NC', 'ND', 'OH', 'OK',
      'PA', 'RI', 'SC', 'SD',
      'TN', 'TX', 'UT', 'VT',
      'VA', 'WA', 'WV', 'WI', 
      'WY', 'DC', 'AS', 'GU', 
      'MP', 'PR', 'UM', 'VI' 
    ]);

    this.stateMap = new Map<string,string>([['Alabama','AL'],['Arkansas','AK']]);
    for(var state of this.twoLetterStates) {

    }

    // console.log(this.states.size);
  }

  isUSState(value: string) : boolean {
      if(this.twoLetterStates.has(value)) {
        return true;
      } else return false;
  }

  // use this to display state abbreviation
  test() {
    return Object.values(this.stateMap).includes('AL');
  }
}
