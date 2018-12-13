import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {Options} from '../pages/home/home';
import {Sim} from "@ionic-native/sim";
import {Mask} from './utils/mask';
import {SQLite} from "@ionic-native/sqlite";
import {DatabaseProvider} from '../providers/database/database';
import {SimProvider} from '../providers/sim/sim';
import {Network} from "@ionic-native/network";
import {ParamsProvider} from "../providers/sim/params";
import {HttpClientModule} from "@angular/common/http";
import {HomePageModule} from "../pages/home/home.module";
import {SimInsertPageModule} from "../pages/sim-insert/sim-insert.module";
import {ResponsePageModule} from "../pages/response/response.module";

@NgModule({
  declarations: [
    MyApp,
    // HomePage,
    // SimInsertPage,
    // ResponsePage,
    Mask,
    Options,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HomePageModule,
    SimInsertPageModule,
    ResponsePageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage,
    // SimInsertPage,
    // ResponsePage,
    Options
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Sim,
    SQLite,
    DatabaseProvider,
    SimProvider,
    ParamsProvider,
    Network
  ]
})
export class AppModule {
}
