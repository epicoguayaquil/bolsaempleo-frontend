import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-bannerOfertasLaborales',
  templateUrl: './bannerOfertasLaborales.component.html',
  styleUrls: ['./bannerOfertasLaborales.component.css'],
  standalone: true,
  imports:[ImageModule]
})
export class BannerOfertasLaboralesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
