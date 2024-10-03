import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class RoutePortalStrategy implements RouteReuseStrategy {
  private storedRoutes: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path === 'eventos' || route.routeConfig?.path === 'servicios';
    //return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (route?.routeConfig?.path !== undefined) {
      this.storedRoutes[route.routeConfig.path] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route?.routeConfig?.path !== undefined) {
      return !!this.storedRoutes[route.routeConfig.path];
    }
    return false
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle|null {
    if (route?.routeConfig?.path !== undefined) {
      if (!this.storedRoutes[route.routeConfig.path]) {
        return null;
      }
      return this.storedRoutes[route.routeConfig.path];
    }
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}