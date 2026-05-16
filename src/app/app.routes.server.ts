import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'movies/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'category/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'cinemas/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
