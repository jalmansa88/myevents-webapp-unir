import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { DownloadService } from '../../download.service';
import { Imagen } from '../../interfaces/image.interface';
import { EventsService } from '../../services/events.service';
import { LoginService } from '../../services/login.service';

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
  role: number;

  constructor(
    private afs: AngularFirestore,
    private eventService: EventsService,
    private activatedRoute: ActivatedRoute,
    private downloader: DownloadService,
    public loginService: LoginService
  ) {}

  ngOnInit() {
    this.event_uid = this.activatedRoute.snapshot.queryParams.eventuid;
    // const event_uid = this.activatedRoute.snapshot.params['eventuid'];

    this.eventService.findByUid(this.event_uid).then(result => {
      this.event = result;
    });

    this.images = this.afs
      .collection<Imagen>('img', ref =>
        ref.where('event_uid', '==', this.event_uid)
      )
      .valueChanges();

    const rolesMap = this.loginService.user.eventRolesMap;
    
    rolesMap ? (this.role = rolesMap.get(this.event_uid)) : (this.role = 0);
    console.log('role', this.role);
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
      .catch(err => {});
  }
}
