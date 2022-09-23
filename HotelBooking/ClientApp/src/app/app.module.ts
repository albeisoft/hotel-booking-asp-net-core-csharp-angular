import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
//import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CategoriesComponent } from './categories/categories.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ClientsComponent } from './clients/clients.component';
import { ReservationsComponent } from './reservations/reservations.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,    
    //FetchDataComponent,
    CategoriesComponent,
    RoomsComponent,
    ClientsComponent,
    ReservationsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },      
      //{ path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard] },
      { path: 'categories', component: CategoriesComponent, canActivate: [AuthorizeGuard] },
      { path: 'rooms', component: RoomsComponent, canActivate: [AuthorizeGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthorizeGuard] },
      { path: 'reservations', component: ReservationsComponent, canActivate: [AuthorizeGuard] },
    ]),
    BrowserAnimationsModule,
    BrowserModule,    
    ReactiveFormsModule,    
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    //MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    //MatRadioModule,
    MatCardModule,
    //MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,    
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
