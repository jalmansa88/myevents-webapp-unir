import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { APP_ROUTING } from './app.routes';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';
import { RegistrationService } from './services/registration.service';
import { UserService } from './services/user.service';
import { LoginComponent } from './components/login/login.component';
import { ServiceProviderComponent } from './components/userPanels/service-provider/service-provider.component';
import { EventAdminComponent } from './components/userPanels/event-admin/event-admin.component';
import { EventsComponent } from './components/userPanels/events/events.component';
import { RoleRouterService } from './services/role-router.service';
import { EventsService } from './services/events.service';

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
    ServiceProviderComponent
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
export class AppModule { }
