import { NgModule } from '@angular/core';
import { NgbModule, NgbTooltip, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';


import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { Weather } from './classes/weather';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BackgroundComponent } from './components/background/background.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  {path: 'weather-display/:keyword', component: WeatherDisplayComponent},
  {path: '404/:keyword', component: NotFoundComponent},
  // {path: 'search' , component: SearchComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    WeatherDisplayComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    BackgroundComponent,
    NotFoundComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"}),
    NgbModule,
    NgbCollapseModule,
    NgbTooltipModule
  ],
  exports: [
    RouterModule,
    NgbModule
  ],
  providers: [WeatherDisplayComponent, Weather, BackgroundComponent, NgbTooltipConfig],
  bootstrap: [AppComponent]
})
export class AppModule {}
