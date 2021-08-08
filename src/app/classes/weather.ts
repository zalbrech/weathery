export class Weather {
    public theDate: Date = new Date();
    public theTime: string = '';
    public theFormattedDateString: string = '';
    public theCity: string = '';
    public theState: string = '';
    public theCountry: string = '';
    public theCurrentTemperature: number = 0;
    public theHighTemperature = 0;
    public theLowTemperature: number = 0;
    public theSunrise: number = 0;
    public theSunset: number = 0;
    public theDescription: string = '';
    public theMainWeather: string = '';
    public theWindSpeed: number = 0;
    public icon: string = '';
}
