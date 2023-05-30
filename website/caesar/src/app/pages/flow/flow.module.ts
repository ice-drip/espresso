import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowRoutingModule } from './flow-routing.module';
import { FlowComponent } from './flow.component';

import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [
    FlowComponent
  ],
  imports: [
    CommonModule,
    FlowRoutingModule,
    MatExpansionModule
  ]
})
export class FlowModule { }
