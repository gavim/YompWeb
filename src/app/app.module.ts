import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ContentComponent } from './content/content.component';
import { CollectionComponent } from './content/collection/collection.component';
import { BrandComponent } from './content/brand/brand.component';
import { UserComponent } from './user/user.component';
import { SharedModule } from './shared/shared.module';
import { ItemComponent } from './content/item/item.component';
import { ItemDetailComponent } from './content/item/item-detail/item-detail.component';
import { ItemListComponent } from './content/item/item-list/item-list.component';
import { ItemListSelectComponent } from './content/collection/item-list-select/item-list-select.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    ContentComponent,
    ItemComponent,
    CollectionComponent,
    BrandComponent,
    UserComponent,
    ItemComponent,
    ItemDetailComponent,
    ItemListComponent,
    ItemListSelectComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [AuthService, AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
