import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { FlowRoutingModule } from './flow-routing.module';
import { FlowComponent } from './flow.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [FlowComponent],
  imports: [
    CommonModule,
    FlowRoutingModule,
    MatExpansionModule,
    DragDropModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSliderModule,
    FormsModule,
    MatInputModule,
    HighlightModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        themePath: 'node_modules/highlight.js/styles/github.css',
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
})
export class FlowModule {}
