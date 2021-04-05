import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, HostListener } from '@angular/core';
import { gsap, TimelineMax, TweenLite } from 'gsap';
import { Draggable } from 'gsap/Draggable';

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
  proxy: Element;
  cellWidth = 250;
  numCells: number;
  cellStep: number;
  wrapWidth: number;
  baseTL: TimelineMax;
  tweenLite: TweenLite;
  animation;
  draggable: Draggable;
  picker: Element;
  argetX: number = 0;
  lastTarget: number = 0;

  /* swipeArray = {
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
  width: any; */
  constructor(private render: Renderer2) { }
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChildren('cell') cell: QueryList<ElementRef>;
  @ViewChildren('leftArrow') leftArrow: QueryList<ElementRef>;
  @ViewChildren('rightArrow') rightArrow: QueryList<ElementRef>;

  /*  constructor() {
     this.getScreensize();
   }
  */
  ngOnInit() {
    gsap.registerPlugin(Draggable);
    gsap.defaults({ ease: 'none' });
  }

  ngAfterViewInit() {
    this.init();
    this.createBaseTL();

  }

  init() {
    this.numCells = this.cell.length;
    this.cellStep = 1 / this.numCells;
    this.wrapWidth = this.cellWidth * this.numCells;
    this.proxy = this.render.createElement('div');
    TweenLite.set(this.proxy, { x: "+=0" });
    this.picker = this.container.nativeElement;
  }

  createBaseTL() {
    this.baseTL = new TimelineMax({ paused: true });
    this.createTweenLite();
    this.loopAndInitCell();
    this.animate();
    this.drag();
  }

  createTweenLite() {
    TweenLite.set(this.picker, {
      //perspective: 1100,
      width: this.wrapWidth - this.cellWidth
    });
  }

  loopAndInitCell() {

    this.cell.forEach((ele, index) => {
      //console.log("ele ", ele.nativeElement.firstChild);
      this.initCell(ele.nativeElement, index);
    });
  }

  animate() {
    this.animation = new TimelineMax({ repeat: -1, paused: true }).add(this.baseTL.tweenFromTo(1, 2, { immediateRender: true }));
  }

  drag() {
    this.draggable = new Draggable(this.proxy, {
      type: 'x',
      trigger: this.picker,
      throwProps: true,
      callbackScope: this,
      cursor: 'move',
      onDrag: this.updateProgress,
      onThrowUpdate: this.updateProgress,
      snap: this.snapX,
      onThrowComplete: () => {
        console.log('onThrowComplete');
        // TODO: animation that inject selected card title
      }
    });
  }

  initCell(ele, index: number) {
    TweenLite.set(ele, {
      width: this.cellWidth,
      scale: 0.6,
      x: -this.cellWidth
    });
    const tlm = new TimelineMax({ repeat: 1 })
      .to(ele, 1, { x: `+=${this.wrapWidth}`/*, rotationX: -rotationX*/ }, 0)
      .to(ele, this.cellStep, { color: '#009688', scale: 1, repeat: 1, yoyo: true, borderColor: '#0000ff' }, 0.5 - this.cellStep);
    this.baseTL.add(tlm, index * -this.cellStep);
  }

  snapX(x): number {
    return Math.round(x / this.cellWidth) * this.cellWidth;
  }

  updateProgress() {
    this.animation.progress(gsap.utils.wrap(0, 1, (this.draggable.x as number) / this.wrapWidth));
  }
  animateSlides(direction: number, event: Event) {
    console.log("gotoPrevSlide ");
    /* var x = gsap.getProperty(this.picker, 'x'); */
    var x = this.snapX(this.draggable.x + direction * this.cellWidth);

    TweenLite.to(this.proxy, 1, {
      x: x,
      onUpdate: () => {
        this.animation.progress((x as number) / this.wrapWidth);
      }
    });
  }

  
}

