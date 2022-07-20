import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  

  // List of two letter US state abbreviations
  private twoLetterStates:Set<string>;

  // Map <k,v> = <full name, two letter abbreviation>
  private stateMap:Map<string,string>;
  
  constructor(private httpClient: HttpClient) { 
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
  }

  // check if valid two letter US state abbreviation
  isTwoLetterAbbreviation(input: string) : boolean {
    return this.twoLetterStates.has(input);
  }

  // checks whether passed string is a US state
  isUSState(key: string) : boolean {
    return this.stateMap.has(key);
  }

  // Return the two letter abbreviation of US states
  getTwoLetterAbbreviation(key: string) : string {
    return this.stateMap.get(key)!;
  }
}
