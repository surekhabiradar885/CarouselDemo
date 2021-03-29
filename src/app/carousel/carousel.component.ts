import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() title;
  @Input() index:number;
  newTitle:string;
  newTitleArr:string[];
  constructor() { 
    
  }
  ngOnInit(): void {
    this.newTitleArr=this.title.split(' ');  
   }
    
}
