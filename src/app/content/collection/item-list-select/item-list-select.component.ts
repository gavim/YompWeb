import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-list-select',
  templateUrl: './item-list-select.component.html',
  styleUrls: ['./item-list-select.component.css']
})
export class ItemListSelectComponent implements OnInit, OnChanges {
  @Input() selectedItems: string[];
  @Output() itemChanged = new EventEmitter<string[]>();

  items: Observable<any>;
  itemStatus: any;

  constructor(public db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.items = this.db.object('/items').valueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.selectedItems) {
      this.selectedItems = [];
    }
    this.db.object('/items').query.once('value').then(dbItems => {
      this.itemStatus = {};
      for (const itemId in dbItems.val()) {
        if (this.selectedItems.includes(itemId)) {
          this.itemStatus[itemId] = 1;
        } else {
          this.itemStatus[itemId] = 0;
        }
      }
    });
    console.log(this.itemStatus)
  }

  itemSelected(itemId: any) {
    if (this.itemStatus[itemId] && this.itemStatus[itemId] === 1) {
      this.itemStatus[itemId] = 0;
    } else {
      this.itemStatus[itemId] = 1;
    }

    const selectedItemsNew: string[] = [];
    for (const [key, status] of Object.entries(this.itemStatus)) {
      if (status === 1) {
        selectedItemsNew.push(key);
      }
    }
    this.itemChanged.emit(selectedItemsNew);
  }
}
