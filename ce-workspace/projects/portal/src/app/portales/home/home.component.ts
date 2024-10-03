import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports:[
    CardModule, ButtonModule, RippleModule, RouterLink
  ]
})
export class HomeComponent implements OnInit {

  private renderer: Renderer2 = inject(Renderer2);

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'backgroundColor', '#57B2D9');
    this.renderer.setStyle(document.body, 'backgroundImage', 'none');
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'backgroundColor');
    this.renderer.removeStyle(document.body, 'backgroundImage');
  }

  getUlr(path){
    return environment.domain + path;
  }
}
