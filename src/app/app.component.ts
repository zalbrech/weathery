import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'weathery';

  
  constructor(private router: Router, private themeService: ThemeService, private renderer: Renderer2) {}
  
  ngOnInit() {
    this.router.navigateByUrl('/search');
    
    this.themeService.themeChanges().subscribe(theme => {
      if(theme.oldValue) {
        this.renderer.removeClass(document.body, theme.oldValue);
      }
      this.renderer.addClass(document.body, theme.newValue);
    })
  }
  
}
