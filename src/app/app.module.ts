import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';


import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { Weather } from './classes/weather';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  {path: 'weather-display/:keyword', component: WeatherDisplayComponent},
  {path: 'search' , component: SearchComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    WeatherDisplayComponent,
    SearchComponent,
    ThemeToggleComponent,
    HeaderComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [WeatherDisplayComponent, Weather],
  bootstrap: [AppComponent]
})
export class AppModule {}
