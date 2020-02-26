import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { checkURL, generateUUID } from '../../shared/functions';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  query = '';

  collectionInfoForm = this.fb.group({
    title: ['', Validators.required],
    rank: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    featured: [false],
    note: ['']
  });

  collections: Observable<any>;
  curCollectionId: string;
  curCollection: Observable<any>;

  feedImageUrl: string;
  bannerImageUrl: string;
  logoImageUrl: string;
  imgUploadCnt = 0;

  showDeleteConfirmModal = false;

  items: string[];

  constructor(public db: AngularFireDatabase,
              private storage: AngularFireStorage,
              private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.collections = this.db.object('/collections').valueChanges();
  }

  switchCollection(newCid: string): void {
    this.collectionInfoForm.reset();
    if (!newCid || newCid === '-1') {
      // create new item collection
    } else {
      this.curCollectionId = newCid;
      this.curCollection = this.db.object('/collections/' + this.curCollectionId).valueChanges();
      this.curCollection.subscribe(dbCollection => {
        this.collectionInfoForm.patchValue(dbCollection);
        this.feedImageUrl = dbCollection.feedImageUrl;
        this.bannerImageUrl = dbCollection.bannerImageUrl;
        this.logoImageUrl = dbCollection.logoImageUrl;
        this.items = dbCollection.items;
      });
    }
  }

  searchUpdate(value: string) {
    this.query = value.toLowerCase();
  }

  createNewCollection() {
    this.router.navigate(['/admin/content/collection']);
    this.collectionInfoForm.reset();
    this.feedImageUrl = '';
    this.bannerImageUrl = '';
    this.logoImageUrl = '';
    this.curCollectionId = '-1';
  }

  collectionSelected(cid: any) {
    this.switchCollection(cid);
  }

  imgSelected(event, dest: string): void {
    this.imgUploadCnt++;
    this.pushFileToStorage(event.target.files[0], dest);
  }

  pushFileToStorage(file: File, dest: string): void {
    const path = generateUUID() + '_' + file.name;
    const fileRef = this.storage.ref(path);
    // const task = this.storage.upload(path, file);
    fileRef.put(file).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(imgurl => {
          this[dest] = imgurl;
          this.imgUploadCnt--;
        });
      })
    ).subscribe();
  }

  deleteFileByUrl(fileUrl: string): void {
    if (checkURL(fileUrl)) {
      this.storage.storage.refFromURL(fileUrl).delete().then(() => {
        // File deleted successfully
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  selectedItemChanged(ids: [string]) {
    this.items = ids;
  }

  submit() {
    if (this.collectionInfoForm.valid) {
      const submissionModel = {
        title: this.collectionInfoForm.value.title,
        note: this.collectionInfoForm.value.note,
        rank: this.collectionInfoForm.value.rank,
        featured: this.collectionInfoForm.value.featured,
        ...this.feedImageUrl && { feedImageUrl: this.feedImageUrl },
        ...this.bannerImageUrl && { bannerImageUrl: this.bannerImageUrl },
        ...this.logoImageUrl && { logoImageUrl: this.logoImageUrl },
        ...(this.items && this.items.length !== 0) && { items: this.items }
      };

      const dbCollectionList = this.db.list('/collections/');

      if (!this.curCollectionId || this.curCollectionId === '-1') {
        dbCollectionList.push(submissionModel).then(postedItem => {
          // this.id = postedItem.key;
        });
      } else {
        dbCollectionList.update(this.curCollectionId, submissionModel).then(updated => {
          // refresh page
        });
      }
    }
  }

  onDeleteCollection(): void {
    this.deleteFileByUrl(this.feedImageUrl);
    this.deleteFileByUrl(this.bannerImageUrl);
    this.deleteFileByUrl(this.logoImageUrl);

    const key = this.curCollectionId;
    const postRef = this.db.database.ref('/collections/' + key);
    postRef.set(null);
    this.router.navigate(['/admin/content/collection']);
  }

  cancel(): void {
    this.db.object('/collections/' + this.curCollectionId).valueChanges()
      .subscribe(dbCollection => {
        this.collectionInfoForm.patchValue(dbCollection);
        // @ts-ignore
        this.feedImageUrl = dbCollection.feedImageUrl;
        // @ts-ignore
        this.bannerImageUrl = dbCollection.bannerImageUrl;
        // @ts-ignore
        this.logoImageUrl = dbCollection.logoImageUrl;
      });
  }
}
