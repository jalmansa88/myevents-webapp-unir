import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { APP_ROUTING } from './app.routes';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PhotosComponent } from './components/photos/photos.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { EventAdminComponent } from './components/userPanels/event-admin/event-admin.component';
import { EventsComponent } from './components/userPanels/events/events.component';
import { ServiceProviderComponent } from './components/userPanels/service-provider/service-provider.component';
import { UsersEventsComponent } from './components/users-events-list/users-events-list.component';
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';
import { RolePipe } from './pipes/role.pipe';
import { EventsService } from './services/events.service';
import { ImageUploaderService } from './services/image-uploader.service';
import { LoginService } from './services/login.service';
import { RegistrationService } from './services/registration.service';
import { RoleRouterService } from './services/role-router.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { DownloadService } from './download.service';

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
    UsersEventsComponent,
    RolePipe,
    PhotosComponent,
    UploaderComponent,
    NgDropFilesDirective
  ],
  imports: [
    APP_ROUTING,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AngularFireAuthModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    UserService,
    TokenService,
    LoginService,
    EventsService,
    DownloadService,
    RoleRouterService,
    RegistrationService,
    ImageUploaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
