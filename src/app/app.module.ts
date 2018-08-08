import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { APP_ROUTING } from './app.routes';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { EventAdminComponent } from './components/userPanels/event-admin/event-admin.component';
import { EventsComponent } from './components/userPanels/events/events.component';
import { ServiceProviderComponent } from './components/userPanels/service-provider/service-provider.component';
import { UsersEventsComponent } from './components/users-events-list/users-events-list.component';
import { EventsService } from './services/events.service';
import { LoginService } from './services/login.service';
import { RegistrationService } from './services/registration.service';
import { RoleRouterService } from './services/role-router.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    EventsComponent,
    NavbarComponent,
    EventAdminComponent,
    RegistrationComponent,
    ServiceProviderComponent,
    UsersEventsComponent
  ],
  imports: [
    APP_ROUTING,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    UserService,
    TokenService,
    LoginService,
    EventsService,
    RoleRouterService,
    RegistrationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
