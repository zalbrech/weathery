import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-background',   
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css'],
  animations: [
      trigger('fade', [
        transition('* => *', [
          style({ opacity: 0 }),
          animate("3s ease-in", style({ opacity: 1 }))
        ])
      ])
    ]
})
export class BackgroundComponent implements OnInit {
  message: string = ""; // string containing path to background image
  animationValue: boolean = false; // flag to trigger @fade animation
  isLoaded: boolean;

  constructor(public themeService: ThemeService) {
    this.isLoaded = false;
   }

  ngOnInit(): void {
    this.themeService.backgroundMessage.subscribe(theMessage => this.message = theMessage);
    this.themeService.animationMessage.subscribe(animationValue => this.animationValue = animationValue);
    console.log(this.animationValue);
    this.isLoaded = true;
  }
}
