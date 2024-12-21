import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './app/environments/environment';

import ThreeGlobe from 'globe.gl';
import Globe from 'globe.gl';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
