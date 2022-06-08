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
  message: string = "";
  animationValue: boolean = false;
  isLoaded: boolean;
  oldMessage: string = "";


  constructor(public themeService: ThemeService) {
    this.isLoaded = false;
   }

  ngOnInit(): void {
    this.themeService.currentMessage.subscribe(theMessage => this.message = theMessage);
    this.themeService.animationMessage.subscribe(animationValue => this.animationValue = animationValue);
    console.log(this.animationValue);
    this.isLoaded = true;
    // this.display();
  }

  // TODO: delete after further animation testing
  // display() {
  //   console.log("BACKGROUND DISPLAY CALLED");
  //   // this.toggleState();
  //   this.isLoaded = true;
  //   // this.status = true;
  //   // this.reset();
  // }

  // reset() {
  //   console.log("BACKGROUND RESET CALLED");
  //   this.isLoaded = false;
  //   this.status = false;
  //   console.log("BACKGROUND STATUS = " + this.status);
  //   this.display();
  // }

  
  // for debugging only to check triggering and timing of animation

  // html -> (@fade.start)="onStart($any($event))
  // onStart(event: Event) {
  //   console.log('animation starting ' + new Date());
  // }

  // html -> (@fade.done)="onDone($any($event))
  // onDone(event: Event) {
  //   console.log("animation finished " + new Date());
  //   console.log(event);
  //   // this.toggleState();
  // }
}
