import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-bannerEventos',
  templateUrl: './bannerEventos.component.html',
  styleUrls: ['./bannerEventos.component.css'],
  standalone: true,
  imports:[ImageModule]
})
export class BannerEventosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
