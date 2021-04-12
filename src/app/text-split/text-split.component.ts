import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-split',
  templateUrl: './text-split.component.html',
  styleUrls: ['./text-split.component.css']
})
export class TextSplitComponent implements OnInit {
  @Input() title;
  newTitleArr: string[];
  newTitle: string;
  constructor() { }

  ngOnInit(): void {
    this.newTitleArr = this.title.split(' ');
  }

}
