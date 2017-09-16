import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BlogService } from './service/blog.service';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const appRoutes:Routes = [
  { path:'admin-page', component: AdminPageComponent },
  { path:'login', component: LoginComponent },
  { path: 'landing-page', component: LandingPageComponent}

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
  ],
  providers: [
    BlogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
