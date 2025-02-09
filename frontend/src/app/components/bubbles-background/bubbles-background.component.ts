import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-bubbles-background',
  imports: [],
  templateUrl: './bubbles-background.component.html',
  styleUrl: './bubbles-background.component.scss',
})
export class BubblesBackgroundComponent implements OnInit, OnDestroy {
  private curX = 0;
  private curY = 0;
  private tgX = 0;
  private tgY = 0;
  private interBubble: HTMLDivElement | null = null;
  private animationFrameId: number | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.interBubble = document.querySelector<HTMLDivElement>('.interactive');
    window.addEventListener('mousemove', this.handleMouseMove);
    this.move();
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.tgX = event.clientX;
    this.tgY = event.clientY;
  };

  private move = () => {
    this.curX += (this.tgX - this.curX) / 20;
    this.curY += (this.tgY - this.curY) / 20;
    if (this.interBubble) {
      this.renderer.setStyle(
        this.interBubble,
        'transform',
        `translate(${Math.round(this.curX)}px, ${Math.round(this.curY)}px)`
      );
      this.animationFrameId = requestAnimationFrame(this.move);
    }
  };
}
