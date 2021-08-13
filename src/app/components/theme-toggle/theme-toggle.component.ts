import { Component, OnInit } from '@angular/core';
import { discardPeriodicTasks } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {

  theme: string = 'dark';

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
  }

  toggleTheme() {
    if (this.theme === 'bootstrap') {
      this.theme = 'bootstrap-dark';
    } else {
      this.theme = 'bootstrap';
    }

    this.themeService.setTheme(this.theme);

  }

}
