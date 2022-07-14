import { Renderer2 } from '@angular/core';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { 
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'weathery';

  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.navigateByUrl('/search');
    }
  
}
