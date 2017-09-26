import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BlogService } from './service/blog.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';



const appRoutes:Routes = [
  { path:'admin', component: AdminPageComponent },
  { path:'login', component: LoginComponent },
  { path: 'home', component: LandingPageComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminPageComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    FlashMessagesModule
  ],
  providers: [
    BlogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
