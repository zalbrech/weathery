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
      'AL', 'AK', 
      'AZ', 'AR', 
      'CA', 'CO', 
      'CT', 'DE', 
      'FL', 'GA', 
      'HI', 'ID',
      'IL', 'IN', 
      'IA', 'KS',
      'KY', 'LA', 
      'ME', 'MD',
      'MA', 'MI', 
      'MN', 'MS',
      'MO', 'MT', 
      'NE', 'NV',
      'NH', 'NJ', 
      'NM', 'NY',
      'NC', 'ND', 
      'OH', 'OK',
      'PA', 'RI', 
      'SC', 'SD',
      'TN', 'TX', 
      'UT', 'VT',
      'VA', 'WA', 
      'WV', 'WI', 
      'WY', 'DC', 
      'AS', 'GU', 
      'MP', 'PR', 
      'VI' 
    ]);

    this.stateMap = new Map<string,string>([
      ['Alabama','AL'],['Alaska','AK'],
      ['Arizona','AZ'],['Arkansas','AK'],
      ['California','CA'],['Colorado','CO'],
      ['Connecticut','CT'],['Delaware','DE'],
      ['Florida','FL'],['Georgia','GA'],
      ['Hawaii','HI'],['Idaho','ID'],
      ['Illinois','IL'],['Indiana','IN'],
      ['Iowa','IA'],['Kansas','KS'],
      ['Kentucky','KY'],['Louisiana','LA'],
      ['Maine','ME'],['Maryland','MD'],
      ['Massachusetts','MA'],['Michigan','MI'],
      ['Minnesota','MN'],['Mississippi','MS'],
      ['Missouri','MO'],['Montana','MT'],
      ['Nebraska','NE'],['Nevada','NV'],
      ['New Hampshire','NH'],['New Jersey','NJ'],
      ['New Mexico','NM'],['New York','NY'],
      ['North Carolina','NC'],['North Dakota','ND'],
      ['Ohio','OH'],['Oklahoma','OK'],
      ['Pennsylvania','PA'],['Rhode Island','RI'],
      ['South Carolina','SC'],['South Dakota','SD'],
      ['Tennessee','TN'],['Texas','TX'],
      ['Utah','UT'],['Vermont','VT'],
      ['Virginia','VA'],['Washington','WA'],
      ['West Virginia','WV'],['Wisconsin','WI'],
      ['Wyoming','WI'],['District of Columbia', 'DC'],
      ['American Samoa','AS'],['Guam','GU'],
      ['Northern Mariana Islands','MP'],['Puerto Rico','PR'],
      ['United States Virgin Islands','VI']
    ]);
    
    console.log(this.twoLetterStates.size +  " " + this.stateMap.size);
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
