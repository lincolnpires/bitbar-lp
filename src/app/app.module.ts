import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Result } from '../pages/result/result';
import { VerifyUber } from '../pages/verify-uber/verify-uber';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Result,
    VerifyUber
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Result,
    VerifyUber
  ],
  providers: []
})
export class AppModule {}
