import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';
import {trigger, state, transition, animate, style, query, animateChild} from '@angular/animations';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'], 
})
export class SliderComponent implements OnInit {
   actions = [
    'Mobile internet',
    'Home internet',
    'Get a device',
    'Add a phone-line',
    'Upgrade',
  ];
  swipeArray = {
    startX: 0,
    startY: 0,
    dist: 0,
    threshold: 20,
    allowedTime: 500,
    elapsedTime: 0,
    startTime: 0,
    distX: 0,
    distY: 0,
    restraint: 100,
    currentX: 0,
    currentY: 0,
    swipeDir: 'none',
    rightState: 'out',
    leftState: 'out',
  };

  displaySlide = 5;
  visible:number= 3;
  breakpoint: number = 768;
  visibleSlide = [ ...Array(this.displaySlide).keys() ].map( i => i);

  sliderFlag: boolean = false;
  width: any;
  constructor() {
   /*  this.getScreensize(); */
  }

  ngOnInit(): void {}
  handleswipe(swipeDirPar): void{
    if (swipeDirPar === 'right'){
        this.show_image('right');
      }else if (swipeDirPar === 'left'){
        this.show_image('left');
    }
  }

/* @HostListener('window:resize', ['$event'])
getScreensize(event?): void{
  console.log("innerWidth size ",innerWidth)
   if (innerWidth >= 768 && innerWidth <= 1023){
      this.displaySlide = 3;
   }else if (innerWidth >= 320 && innerWidth <= 768){
      this.displaySlide = 1;
   }else if (innerWidth > 1023){
    this.displaySlide = 5;
   }

   this.visibleSlide = [ ...Array(this.displaySlide).keys() ].map( i => i);
   console.log("visible slide ", this.visibleSlide);
}
 */
  @HostListener('touchstart', ['$event'])
  touchStart(event): void{
     const touchobj = event.changedTouches[0];
     this.swipeArray.dist = 0;
     this.swipeArray.startX = touchobj.pageX;
     this.swipeArray.startY = touchobj.pageY;
     event.preventDefault();
     console.log( "touchstart ",event.preventDefault());
 }

 @HostListener('touchmove', ['$event'])
 touchMove(event): void{
  event.preventDefault()
 }

@HostListener('touchend', ['$event'])
 touchEnd(event): void{
   if (event.srcElement.className.indexOf('control') < 0){
    const touchobj = event.changedTouches[0];
    this.swipeArray.distX = touchobj.pageX - this.swipeArray.startX;
    this.swipeArray.distY = touchobj.pageY - this.swipeArray.startY;
    if (Math.abs(this.swipeArray.distX) >= this.swipeArray.threshold && Math.abs(this.swipeArray.distY) <= this.swipeArray.restraint){
      this.swipeArray.swipeDir = (this.swipeArray.distX < 0) ? 'right' : 'left';
    }else if (Math.abs(this.swipeArray.distY) >= this.swipeArray.threshold && Math.abs(this.swipeArray.distX) <= this.swipeArray.restraint){
      this.swipeArray.swipeDir = (this.swipeArray.distY < 0) ? 'up' : 'down';
    }
    this.handleswipe(this.swipeArray.swipeDir);
    event.preventDefault();
    console.log( "touchend ",event.preventDefault());
  }
}

@HostListener('mousedown', ['$event'])
  mousedown(event): void{
    this.swipeArray.dist = 0;
    this.swipeArray.startX = event.clientX;
    this.swipeArray.startY = event.clientY;
    this.swipeArray.startTime = new Date().getTime();
    event.preventDefault();
     
}

@HostListener('mouseup', ['$event'])
mouseup(event): void{
  if (event.srcElement.className.indexOf('control') < 0){
    this.swipeArray.distX = event.clientX - this.swipeArray.startX;
    this.swipeArray.distY = event.clientY - this.swipeArray.startY;
    this.swipeArray.elapsedTime = new Date().getTime() - this.swipeArray.startTime;
    if (Math.abs(this.swipeArray.distX) >= this.swipeArray.threshold && Math.abs(this.swipeArray.distY) <= this.swipeArray.restraint){
      this.swipeArray.swipeDir = (this.swipeArray.distX < 0) ? 'right' : 'left';
    }else if (Math.abs(this.swipeArray.distY) >= this.swipeArray.threshold && Math.abs(this.swipeArray.distX) <= this.swipeArray.restraint){
      this.swipeArray.swipeDir = (this.swipeArray.distY < 0) ? 'up' : 'down';
    }
    this.handleswipe(this.swipeArray.swipeDir);
    event.preventDefault();
    console.log( "mouseup ",event.preventDefault());
  }
}
 
  arrayRotate(arr: string[], direction: string): string[] {
    if (direction == 'right') {
     
      this.swipeArray.rightState = this.swipeArray.rightState === 'in' ? 'out' : 'in';
      arr.push(arr.shift());
      this.sliderFlag = true;
    } else {
      this.swipeArray.leftState = this.swipeArray.leftState === 'in' ? 'out' : 'in';  
      arr.unshift(arr.pop());
    }
    return arr;
  }
  show_image(direction: string) {   
    
    this.actions = this.arrayRotate(this.actions, direction);
  }

}

