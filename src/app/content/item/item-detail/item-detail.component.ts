import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  generateUUID, dConvert, nextMonthsDates, defaultDate, dateToSeconds,
  defaultDatePlusOne, tConvert, checkURL
} from '../../../shared/functions';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnChanges {
  @Input() itemId: string;
  @Output() hideDetail = new EventEmitter<null>();

  itemInfoForm = this.fb.group({
    title: ['', Validators.required],
    brandId: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0.1)]],
    url: ['', Validators.required],
    note: [''],
    collectionId: [''],
    rank: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    featured: [false, Validators.required]
  });
  tagArray: string[] = [];
  imageUrl: string[] = [];
  imageUrlForDeletion: string[] = [];
  newImageUrl: string[] = [];
  newImageUrlForDeletion: string[] = [];

  curItemId: string;
  curItem: Observable<any>;
  dbTags: Observable<any>;
  dbCollections: Observable<any>;
  dbBrands: Observable<any>;

  imgUploadCnt = 0;

  showNewTagModal = false;
  showDeleteConfirmModal = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private db: AngularFireDatabase,
              private storage: AngularFireStorage) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.itemId || this.itemId === '-1') {
      // create new item
      this.curItemId = '-1';
    } else {
      // display current selected item
      this.curItemId = this.itemId;
      this.curItem = this.db.object('/items/' + this.curItemId).valueChanges();
      this.curItem.subscribe(dbItem => {
        this.itemInfoForm.patchValue(dbItem);
        this.imageUrl = dbItem.imageUrl || [];
        this.newImageUrl = this.imageUrl.slice();
        this.tagArray = dbItem.tag.split('') || [''];
      });
    }
  }

  ngOnInit() {
    this.dbTags = this.db.list('/tags').valueChanges();
    this.dbCollections = this.db.object('/collections').valueChanges();
    this.dbBrands = this.db.object('/brands').valueChanges();
  }

  imgSelected(event, dest: string, index: number): void {
    if (index === -1) {
      index = this.imageUrl.length;
    }
    this.imgUploadCnt++;
    this.pushFileToStorage(event.target.files[0], dest, index);
  }

  // selected(imageResult: ImageResult, dest: string): void {
  //   this.imgUploadCnt++;
  //
  //   if (imageResult.error) alert(imageResult.error);
  //   if (this[dest] != null) this.deleteFileByUrl(this[dest]);
  //
  //   this[dest] = imageResult.resized && imageResult.resized.dataURL
  //     || imageResult.dataURL;
  //
  //   this.ng2ImgToolsService.compress([imageResult.file], 0.1).subscribe(result => {
  //     this.pushFileToStorage(result, dest);
  //   }, error => {
  //     console.error("Compression error:", error);
  //   });
  // }

  pushFileToStorage(file: File, dest: string, index: number): void {
    const path = generateUUID() + '_' + file.name;
    const fileRef = this.storage.ref(path);
    // const task = this.storage.upload(path, file);
    fileRef.put(file).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(imgurl => {
          if (this[dest][index] != null) {
            this.imageUrlForDeletion.push(this[dest][index]);

            this.deleteFileByUrl(this[dest][index]);
          }
          this[dest][index] = imgurl;
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

  submit(): void {
    if (this.itemInfoForm.valid) {
      const submissionModel = {
        title: this.itemInfoForm.value.title,
        brandId: this.itemInfoForm.value.brandId,
        price: this.itemInfoForm.value.price,
        url: this.itemInfoForm.value.url,
        note: this.itemInfoForm.value.note,
        collectionId: this.itemInfoForm.value.collectionId,
        rank: this.itemInfoForm.value.rank,
        featured: this.itemInfoForm.value.featured,

        tag: this.tagArrayToString(this.tagArray),
        imageUrl: this.imageUrl
      };

      const dbItemList = this.db.list('/items/');

      if (this.curItemId === '-1') {
        dbItemList.push(submissionModel).then(postedItem => {
          // this.id = postedItem.key;
        });
      } else {
        dbItemList.update(this.curItemId, submissionModel).then(updated => {
          // refresh page
        });
      }
    }
  }

  onTagChanged(event: boolean, index: number) {
    this.tagArray[index] = event ? '1' : '0';
  }

  tagArrayToString(tagArray: string[]): string {
    for (let i = 0; i < tagArray.length; i++) {
      if (!tagArray[i] || tagArray[i] === '') {
        tagArray[i] = '0';
      }
    }
    return tagArray.join('');
  }

  onAddNewTag(newTag: HTMLInputElement) {
    this.showNewTagModal = false;
    this.db.list('/tags').push(newTag.value);
  }

  onDeleteItem(): void {
    // this.deleteFileByUrl(this.feed_image_url);

    const key = this.itemId;
    const postRef = this.db.database.ref('/posts/' + key);
    postRef.once('value').then((snapshot) => {
      this.db.database.ref('/past-events/' + key + '/info/').update({
        name: snapshot.val().name,
        int_start_date: snapshot.val().int_start_date,
        int_end_date: snapshot.val().int_end_date,
        location: snapshot.val().location,
        description: snapshot.val().description
      });
      postRef.set(null);
    });

    const pstEvtCi = this.db.database.ref('/past-events/' + key + '/user-ci/');
    const evtUsrRef = this.db.database.ref('/post-user-ref/' + key);
    // evtUsrRef.child('male').once("value")
    //   .then((snapshot) => {
    //     snapshot.forEach((childSnapshot) => {
    //       pstEvtCi.update(childSnapshot.val(), false);
    //     });
    //   }).then((result) => {
    //     evtUsrRef.child('female').once("value")
    //       .then((snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //           pstEvtCi.update(childSnapshot.val(), false);
    //         });
    //       });
    //   }).then((result) => {
    //     evtUsrRef.set(null);
    //     pstEvtCi.update(this.db.database.ref('/post-user-ci/' + key).val())
    //       .then((result) => {
    //         this.db.database.ref('/post-user-ci/' + key).set(null);
    //       })
    //   })

    this.db.database.ref('/post-user-match-ref/' + key).set(null);
    this.db.database.ref('/post-user-new-matches/' + key).set(null);
    // this.db.database.ref('/post-user-messages/' + key).set(null);
    // this.db.database.ref('/post-user-activity-ref/' + key).set(null);

    this.router.navigate(['/admin/']);
  }

  cancel(): void {
    this.hideDetail.emit();
  }
}
