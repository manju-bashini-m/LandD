import { Component } from '@angular/core';

@Component({
  selector: 'app-tn-structure',
  imports: [],
  templateUrl: './tn-structure.component.html',
  styleUrl: './tn-structure.component.css'
})
export class TnStructureComponent {

   slideImages = [
    "./assets/sliderImage/Slide1.jpg",
    "./assets/sliderImage/Slide2.jpg",
    "./assets/sliderImage/Slide3.jpg",
     "./assets/sliderImage/Slide4.jpg",
    "./assets/sliderImage/Slide5.jpg",
    "./assets/sliderImage/Slide6.jpg",
     "./assets/sliderImage/Slide7.jpg",
    "./assets/sliderImage/Slide8.jpg",
    "./assets/sliderImage/Slide9.jpg",
     "./assets/sliderImage/Slide10.jpg"
    
  ]

  slideImage = "./assets/sliderImage/Slide1.jpg";

  constructor(){
    var index = 0;
    setInterval(()=>{
      if(index ==this.slideImages.length)
        index = 0;
      this.imageChange(index++);
    },3000);
  }

  // this method is used to change the image in the slider
  imageChange(index:any) {
    const imgElement = document.getElementById('slideImages') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.slideImages[index];
    }
  }
}
