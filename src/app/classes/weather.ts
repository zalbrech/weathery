export class Weather {
    public theDate: Date = new Date();
    public theTime: string = '';
    public theFormattedDateString: string = '';
    public theCity: string = '';
    public theState: string = '';
    public theCountry: string = '';
    public theCurrentTemperature: number = 0;
    public theHighTemperature: number = 0;
    public theLowTemperature: number = 0;
    public theSunrise: string = '';
    public theSunset: string = '';
    public theDescription: string = '';
    public theMainWeather: string = '';
    public theWindSpeed: number = 0;
    public theIcon: string = '';
    public theIconPath: string = "assets/images/weather-icons/"; 
    public theBackground: string = '';

}