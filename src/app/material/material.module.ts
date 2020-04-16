import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SliderModule } from '@syncfusion/ej2-angular-inputs';

import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatSliderModule } from '@angular/material/slider'; 

const MaterialComponents = [
  MatSelectModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  LayoutModule,
  MatNativeDateModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatRadioModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatSliderModule,
  SliderModule
];

@NgModule({
  imports: [CommonModule, MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
