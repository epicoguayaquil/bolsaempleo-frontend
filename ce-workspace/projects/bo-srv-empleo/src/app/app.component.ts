import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CatalogoDBService, CatalogoService } from '../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Empleabilidad';

  private catalogoDBService: CatalogoDBService = inject(CatalogoDBService);
  private catalogoService: CatalogoService = inject(CatalogoService);

  ngOnInit(): void {
    this.updateCatalogs();
  }

  // carga de catalogos en el LOCALDB
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
