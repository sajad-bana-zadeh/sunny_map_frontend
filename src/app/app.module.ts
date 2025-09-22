import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { PointDetailsComponent } from './components/point-details/point-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SearchPanelComponent,
    PointDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }