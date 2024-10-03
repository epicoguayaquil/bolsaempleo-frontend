import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CatalogoDBService } from '../../../centroemprendimiento-lib/src/lib/servicios/CatalogoDB.service';
import { CatalogoService } from '../../../centroemprendimiento-lib/src/lib/servicios/Catalogo.service';
import { LoginService, TipoRegistro } from './sesion/servicios/login.service';
import { ParametrosSistemaService } from '../../../centroemprendimiento-lib/src/lib/servicios/ParametrosSistema.service';
import { filter } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from './sesion/loginModal/loginModal.component';
import { ConfigService } from '../../../centroemprendimiento-lib/src/public-api';
import { environment, UrlSharedRedesSociales } from '../../../environments/environment';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, CommonModule, LoginModalComponent, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portal';

  sidebarVisible: boolean = false;
  showLoginComponent: boolean = true;
  
  private titleService: Title = inject(Title);
  private router: Router = inject(Router);
  private catalogoDBService: CatalogoDBService = inject(CatalogoDBService);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private loginService: LoginService = inject(LoginService);
  private parametrosSistemaService:ParametrosSistemaService = inject(ParametrosSistemaService);
  private configService:ConfigService = inject(ConfigService);

  ngOnInit() {
    this.configService.environment = environment;
    this.configService.urlSharedRedesSociales = UrlSharedRedesSociales;
    this.parametrosSistemaService.cargarParametrosDefault();
    this.router.events
    .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Filtra solo eventos de tipo NavigationEnd
    )
    .subscribe((event) => {
        if (event.urlAfterRedirects.includes('/evento')) {
          this.loginService.app = 'EPICOPORTALEVENTO';
          this.loginService.nameApp = "Portal de Servicios/Talleres";
          this.loginService.tipoRegistro = TipoRegistro.PERSONA;
          this.titleService.setTitle('Eventos'); // Cambia el título a "Eventos"
        } else if (event.urlAfterRedirects.includes('/oferta')) {
          this.titleService.setTitle('Bolsa de Empleo'); // Cambia el título a "Ofertas Laborales"
          this.loginService.app = 'EPICOPORTALES';
          this.loginService.nameApp = "Bolsa de Empleo";
          this.loginService.tipoRegistro = TipoRegistro.POSTULANTE;
        } else {
          this.titleService.setTitle('Portal Epico'); // Título por defecto
        }
        const isExcluded = this.loginService.isRouteExcluded(event.url);
        this.showLoginComponent = !isExcluded;
    });
    this.loginService.verifyToken().then();
    this.updateCatalogs();
  }

  private async updateCatalogs() {
    this.catalogoService.get('TIPO_CATALOGO', {front: 'PORTAL'}).subscribe(catalogTypes => {
      for (const type of catalogTypes?.data) {
        this.catalogoDBService.getCatalogPromise(type.nemonico).then( localCatalog =>{
          if (!localCatalog || localCatalog.version < type.version) {
            console.log(`El catálogo ${type.nemonico} ha inicia actualizacion a la versión ${type.version}.`);
            this.catalogoService.get(type.nemonico).subscribe(data =>{
              let tipoCatalogoUpdate = {...type, items: data?.data}
              this.catalogoDBService.addOrUpdateCatalog(tipoCatalogoUpdate);
              console.log(`El catálogo ${type.nemonico} ha sido actualizado a la versión ${type.version}.`);
            });
          }
        });
      }
    });
    const catalogTypes = await this.catalogoService.get('TIPO_CATALOGO', {front: 'PORTAL'}).toPromise();

    
  }
}
