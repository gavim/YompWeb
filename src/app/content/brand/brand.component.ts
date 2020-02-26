import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { checkURL, generateUUID } from '../../shared/functions';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  query = '';

  brandInfoForm = this.fb.group({
    title: ['', Validators.required],
    note: ['']
  });

  brands: Observable<any>;
  curBrandId: string;
  curBrand: Observable<any>;

  bannerImageUrl: string;
  logoImageUrl: string;
  imgUploadCnt = 0;

  showDeleteConfirmModal = false;

  constructor(public db: AngularFireDatabase,
              private storage: AngularFireStorage,
              private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.brands = this.db.object('/brands').valueChanges();
  }

  switchBrand(newCid: string): void {
    this.brandInfoForm.reset();
    if (!newCid || newCid === '-1') {
      // create new item brand
    } else {
      this.curBrandId = newCid;
      this.curBrand = this.db.object('/brands/' + this.curBrandId).valueChanges();
      this.curBrand.subscribe(dbBrand => {
        this.brandInfoForm.patchValue(dbBrand);
        this.bannerImageUrl = dbBrand.bannerImageUrl;
        this.logoImageUrl = dbBrand.logoImageUrl;
      });
    }
  }

  searchUpdate(value: string) {
    this.query = value.toLowerCase();
  }

  createNewBrand() {
    this.router.navigate(['/admin/content/brand']);
    this.brandInfoForm.reset();
    this.bannerImageUrl = '';
    this.logoImageUrl = '';
    this.curBrandId = '-1';
  }

  brandSelected(cid: any) {
    this.switchBrand(cid);
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

  submit() {
    if (this.brandInfoForm.valid) {
      const submissionModel = {
        title: this.brandInfoForm.value.title,
        note: this.brandInfoForm.value.note,
        ...this.bannerImageUrl && { bannerImageUrl: this.bannerImageUrl },
        ...this.logoImageUrl && { logoImageUrl: this.logoImageUrl }
      };

      const dbBrandList = this.db.list('/brands/');

      if (!this.curBrandId || this.curBrandId === '-1') {
        dbBrandList.push(submissionModel).then(postedItem => {
          // this.id = postedItem.key;
        });
      } else {
        dbBrandList.update(this.curBrandId, submissionModel).then(updated => {
          // refresh page
        });
      }
    }
  }

  onDeleteBrand(): void {
    this.deleteFileByUrl(this.bannerImageUrl);
    this.deleteFileByUrl(this.logoImageUrl);

    const key = this.curBrandId;
    const postRef = this.db.database.ref('/brands/' + key);
    postRef.set(null);
    this.router.navigate(['/admin/content/brand']);
  }

  cancel(): void {
    this.db.object('/brands/' + this.curBrandId).valueChanges()
      .subscribe(dbBrand => {
        this.brandInfoForm.patchValue(dbBrand);
        // @ts-ignore
        this.bannerImageUrl = dbBrand.bannerImageUrl;
        // @ts-ignore
        this.logoImageUrl = dbBrand.logoImageUrl;
      });
  }
}
