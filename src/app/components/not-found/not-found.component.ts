import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  theKeyword: string;
  constructor(private route: ActivatedRoute) {
    this.theKeyword = "";
  }

  ngOnInit(): void {
    this.initializeKeyword();
  }

  initializeKeyword() {
    this.theKeyword = this.route.snapshot.paramMap.get('keyword')?.toLocaleLowerCase()!;
  }

}
