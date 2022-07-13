export interface Numbers {
    F:number,
    C:number;
  }

export class Weather {
    public F = {
        theCurrentTemperature:0,
        theFeelsLike:0,
        theHighTemperature: 0,
        theLowTemperature: 0,
        theWindSpeed: ''
    }

    public C = {
        theCurrentTemperature:0,
        theFeelsLike:0,
        theHighTemperature: 0,
        theLowTemperature: 0,
        theWindSpeed: ''
    }

    public theCurrentTemp = {
        F:0,
        C:0,
    }
    public theDate: Date = new Date();
    public theTime: string = '';
    public theFormattedDateString: string = '';
    public theCity: string = '';
    public theState: string = '';
    public theCountry: string = '';

    public theCurrentTemperature: number = 0;
    public theFeelsLike: number = 0;
    public theHighTemperature: number = 0;
    public theLowTemperature: number = 0;
    public theWindSpeed: number = 0;

    public theHumidity: number = 0;
    public theSunrise: string = '';
    public theSunset: string = '';
    public theDescription: string = '';
    public theMainWeather: string = '';
    public theIcon: string = '';
    public theIconPath: string = "assets/images/weather-icons/"; 
    public theBackground: string = '';
    public theForecasts: any[] = [];
}