import { Directive, ElementRef, Host, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollToTopDir]'
})
export class ScrollToTopDirDirective {
  windowScrolled!: boolean;
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.hideElement();
  }

  @HostListener("window:scroll", []) onWindowScroll() {
      if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
        this.displayElement();
      } 
      else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
        this.hideElement();
      }
  }

  @HostListener('click') scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - (currentScroll / 8));
        }
      })();     
      this.hideElement();
  }

  private displayElement(){
    this.elementRef.nativeElement.style.display = 'block';
  }

  private hideElement(){
    this.elementRef.nativeElement.style.display = 'none';
  }
  
}
