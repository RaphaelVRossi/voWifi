import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {Sim} from "@ionic-native/sim";
import {SimInsertPage} from "../pages/sim-insert/sim-insert";
import {Mask} from './utils/mask';
import {SQLite} from "@ionic-native/sqlite";
import {DatabaseProvider} from '../providers/database/database';
import {SimProvider} from '../providers/sim/sim';
import {HttpClientModule} from "@angular/common/http";
import {ResponsePage} from "../pages/response/response";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SimInsertPage,
    ResponsePage,
    Mask
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SimInsertPage,
    ResponsePage
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
    HttpClientModule,
  ]
})
export class AppModule {
}
