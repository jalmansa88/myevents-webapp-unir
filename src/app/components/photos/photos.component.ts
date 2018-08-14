import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { Imagen } from '../../interfaces/image.interface';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: []
})
export class PhotosComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Imagen>;

  items: Observable<Imagen[]>;

  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const event_uid = this.activatedRoute.snapshot.queryParams.eventuid;
    // const event_uid = this.activatedRoute.snapshot.params['eventuid'];

    this.itemsCollection = this.afs.collection<Imagen>('img', ref =>
      ref.where('event_uid', '==', event_uid)
    );

    this.items = this.itemsCollection.valueChanges();
  }
}
