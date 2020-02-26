import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  @Input() shrink = false;
  @Output() itemSelected = new EventEmitter<string>();

  query = '';
  items: Observable<any>;

  constructor(public db: AngularFireDatabase, private router: Router) {
  }

  ngOnInit(): void {
    this.items = this.db.object('/items').valueChanges();
    // this.posts = this.db.list('/posts', { query: { orderByChild: 'entity_id', equalTo: this.business.$key } });
  }

  searchUpdate(value: string) {
    this.query = value.toLowerCase();
  }

  createNewItem() {
    this.itemSelected.emit('-1');
  }

  editSelectedItem(itemId): void {
    this.itemSelected.emit(itemId);
  }
}
