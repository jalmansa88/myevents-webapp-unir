import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { PhotosComponent } from './components/photos/photos.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { EventAdminComponent } from './components/userPanels/event-admin/event-admin.component';
import { EventsComponent } from './components/userPanels/events/events.component';
import { ServiceProviderComponent } from './components/userPanels/service-provider/service-provider.component';

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'events', component: EventsComponent },
  { path: 'images', component: PhotosComponent },
  { path: 'upload/:uid', component: UploaderComponent },
  { path: 'eventadmin/:uid', component: EventAdminComponent },
  { path: 'serviceprovider', component: ServiceProviderComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
