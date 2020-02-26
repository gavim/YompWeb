import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ContentComponent } from './content/content.component';
import { ItemComponent } from './content/item/item.component';
import { CollectionComponent } from './content/collection/collection.component';
import { BrandComponent } from './content/brand/brand.component';
import { UserComponent } from './user/user.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      { path: '', redirectTo: 'content', pathMatch: 'full' },
      {
        path: 'content',
        component: ContentComponent,
        children: [
          { path: '', redirectTo: 'item', pathMatch: 'full' },
          { path: 'item', component: ItemComponent },
          { path: 'collection', component: CollectionComponent },
          { path: 'collection/:cid', component: CollectionComponent },
          { path: 'brand', component: BrandComponent },
          { path: 'brand/:bid', component: BrandComponent }
        ]
      },
      { path: 'user', component: UserComponent },
    ]
  },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
