import { OnlyNumberDirective } from './views/directive/only-number.directive';
import { NgModule } from '@angular/core';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TableModule,
  TabsModule,
  UtilitiesModule,
  ModalModule,
  SpinnerModule,
} from '@coreui/angular';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { CodeProductComponent } from './views/code-product/code-product.component';
import { RequestProductionComponent } from './views/request-production/request-production.component';
import { ConfirmOrderComponent } from './views/confirm-order/confirm-order.component';
import { InfomationCompanyComponent } from './views/infomation-company/infomation-company.component';
import { InfomationProductionComponent } from './views/infomation-production/infomation-production.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    CodeProductComponent,
    RequestProductionComponent,
    ConfirmOrderComponent,
    InfomationCompanyComponent,
    InfomationProductionComponent,
    OnlyNumberDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    TableModule,
    ModalModule,
    SpinnerModule,
    ToastrModule.forRoot({ timeOut: 1000 }),
    NgSelectModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    IconSetService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
