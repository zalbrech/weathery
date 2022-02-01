import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private states:Set<string>;
  
  constructor() { 
    this.states = new Set<string>([
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

    // console.log(this.states.size);
  }

  isState(value: string) : boolean {
      if(this.states.has(value)) {
        return true;
      } else return false;
  }
}
