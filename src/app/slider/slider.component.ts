import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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
  slideAnimation: any;
  newTitle: string;

  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChildren('cell') cell: QueryList<ElementRef>;

  constructor(private render: Renderer2) { }
  ngOnInit() {
    gsap.registerPlugin(Draggable);
  }

  ngAfterViewInit() {
    gsap.defaults({ ease: 'none', overwrite: "auto" });
    this.init();
    this.createBaseTL();
  }

  init() {
    this.numCells = this.cell.length;
    this.cellStep = 1 / this.numCells;
    this.wrapWidth = this.cellWidth * this.numCells;
    this.proxy = this.render.createElement('div');
    gsap.set(this.proxy, { x: 0 });
    this.slideAnimation = gsap.to({}, { duration: 0.1 });
    this.picker = this.container.nativeElement;
  }

  createBaseTL() {
    this.baseTL = gsap.timeline({ paused: true });
    this.createTweenLite();
    this.loopAndInitCell();
    this.animate();
    this.drag();
  }

  createTweenLite() {
    gsap.set(this.picker, {
      // perspective: 1100,
      width: this.wrapWidth - this.cellWidth
    });
  }

  loopAndInitCell() {
    this.cell.forEach((ele, index) => {
      this.initCell(ele.nativeElement, index);
    });
  }

  animate() {
    this.animation = gsap.timeline({ repeat: -1, paused: true }).add(this.baseTL.tweenFromTo(1, 2, { immediateRender: true }));
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
    gsap.set(ele, {
      width: this.cellWidth,
      scale: 0.6,
      x: -this.cellWidth
    });

    const tlm = gsap.timeline({ repeat: 1 })
      .to(ele, { duration: 1, x: `+=${this.wrapWidth}` }, 0)
      .to(ele, {
        duration: this.cellStep, scale: 1, repeat: 1, yoyo: true, y: '60px',
        callbackScope: this, borderBottom: "9px solid #FFC000", fontWeight: 600
      }, 0.4);

    this.baseTL.add(tlm, index * -this.cellStep);
  }

  snapX(x): number {
    return Math.round(x / this.cellWidth) * this.cellWidth;
  }

  updateProgress() {
    this.animation.progress(gsap.utils.wrap(0, 1, (this.draggable.x as number) / this.wrapWidth));
  }
  setProgess() {
    this.animation.progress(gsap.utils.wrap(0, 1, (gsap.getProperty(this.proxy, 'x') as number) / this.wrapWidth));
  }
  animateSlides(direction: number, event: Event) {
    var x = this.snapX((gsap.getProperty(this.proxy, 'x') as number) + direction * this.cellWidth);
    this.slideAnimation.kill();
    this.slideAnimation = gsap.to(this.proxy, {
      duration: 1,
      x: x,
      callbackScope: this,
      onUpdate: this.setProgess
    });

  }
}

