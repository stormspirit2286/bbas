import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { CodeProductComponent } from './views/code-product/code-product.component';
import { RequestProductionComponent } from './views/request-production/request-production.component';
import { ConfirmOrderComponent } from './views/confirm-order/confirm-order.component';
import { InfomationCompanyComponent } from './views/infomation-company/infomation-company.component';
import { InfomationProductionComponent } from './views/infomation-production/infomation-production.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'code-product',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'code-product',
        component: CodeProductComponent,
      },
      {
        path: 'request-production',
        component: RequestProductionComponent,
      },
      {
        path: 'confirm-order',
        component: ConfirmOrderComponent,
      },
      {
        path: 'info-company',
        component: InfomationCompanyComponent,
      },
      {
        path: 'info-production',
        component: InfomationProductionComponent,
      },
    ],
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'code-product' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
