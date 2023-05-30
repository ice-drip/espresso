import { Component } from '@angular/core';
import { groupBy } from 'lodash-es';
import { algorithmList } from './list';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent {
  public groupList = groupBy(algorithmList,"type")
}
