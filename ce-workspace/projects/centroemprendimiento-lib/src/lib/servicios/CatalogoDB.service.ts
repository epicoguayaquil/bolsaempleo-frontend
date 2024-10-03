import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { CatalogoDB, CatalogoTipo } from '../interfaces/CatalogoDB';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoDBService {

  private cataologoSubject = new Subject<CatalogoTipo>();

  private dbPromise: Promise<IDBPDatabase<CatalogoDB>>;
  constructor() { 
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    return openDB<CatalogoDB>('catalog-database', 1, {
      upgrade(db) {
        db.createObjectStore('catalogs', { keyPath: 'nemonico' });
      },
    });
  }

  async addOrUpdateCatalog(tipo_catalogo: CatalogoTipo) {
    const db = await this.dbPromise;
    await db.put('catalogs', tipo_catalogo);
    this.cataologoSubject.next(tipo_catalogo);
  }

  async getCatalogPromise(nemonico: string) {
    const db = await this.dbPromise;
    return db.get('catalogs', nemonico);
  }

  getCatalog(nemonico: string): Observable<CatalogoTipo>{
    this.dbPromise.then(db => {
      db.get('catalogs', nemonico).then(tipoCatalogo => {
        if(tipoCatalogo){
          this.cataologoSubject.next(tipoCatalogo);
        }
      });
    });
    return this.cataologoSubject.asObservable();
  }

  async getAllCatalogs() {
    const db = await this.dbPromise;
    return db.getAll('catalogs');
  }

  async deleteCatalog(nemonico: string) {
    const db = await this.dbPromise;
    await db.delete('catalogs', nemonico);
  }
}
