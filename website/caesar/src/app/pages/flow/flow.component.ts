import { Component } from '@angular/core';
import { groupBy } from 'lodash-es';
import { algorithmList } from './list';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CryptoItem, execCrypto } from 'src/app/utils/caesar.util';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
})
export class FlowComponent {
  public groupList = groupBy(algorithmList, 'type');
  public originText = "";
  public crypted = "";
  public algorithmDict = Object.fromEntries(algorithmList.map(item=>[item.algorithm,item.type]))
  public list: CryptoItem[] = [
    { label: 'MD5', extension: { case: 'lower', repeat: 1, salt: '' } },
  ];
  public editIndex: number | null = null;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    this.editIndex = null;
  }

  handleClick(index: number) {
    this.editIndex = index;
  }

  handlePushList() {
    this.list.push({
      label: 'MD5',
      extension: { case: 'lower', repeat: 1, salt: '' },
    });
  }

  handleExec(){
    this.crypted = execCrypto(this.originText,this.list);
  }
}
