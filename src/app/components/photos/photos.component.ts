import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { Imagen } from '../../interfaces/image.interface';
import { LoginService } from '../../services/login.service';
import { EventsService } from '../../services/events.service';
import { DownloadService } from '../../download.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  // private imagesCollection: AngularFirestoreCollection<Imagen>;

  event: any;
  event_uid: string;
  images: Observable<Imagen[]>;

  constructor(
    private afs: AngularFirestore,
    private eventService: EventsService,
    private activatedRoute: ActivatedRoute,
    private downloader: DownloadService,
    public loginService: LoginService
  ) { }

  ngOnInit() {
    this.event_uid = this.activatedRoute.snapshot.queryParams.eventuid;
    // const event_uid = this.activatedRoute.snapshot.params['eventuid'];

    this.eventService.findByUid(this.event_uid)
      .then((result) => {
        console.log(result);
        this.event = result;
      });

    this.images = this.afs
      .collection<Imagen>('img', ref =>
        ref.where('event_uid', '==', this.event_uid)
      )
      .valueChanges();


  }

  toggleVip(imagen: Imagen) {
    const imgRef = this.afs.collection<Imagen>('img');

    imgRef.ref
      .where('url', '==', imagen.url)
      .get()
      .then((result: any) => {
        return imgRef.doc(result.docs[0].id).update({ isVip: !imagen.isVip });
      })
      .then(() => {
        console.log('updated permission');
      })
      .catch(err => { });
  }
}
