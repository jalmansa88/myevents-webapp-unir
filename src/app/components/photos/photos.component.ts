import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from '@firebase/firestore-types';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { Imagen } from '../../interfaces/image.interface';
import { DownloadService } from '../../services/download.service';
import { EventsService } from '../../services/events.service';
import { ImageUploaderService } from '../../services/image-uploader.service';
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
    public loginService: LoginService,
    public router: Router,
    private imageService: ImageUploaderService,
    private toastService: ToastrService
  ) {}

  readonly imgRef = this.afs.collection<Imagen>('img');

  async ngOnInit() {
    if (!this.loginService.user) {
      this.router.navigate(['home']);
    }

    this.event_uid = this.activatedRoute.snapshot.queryParams.eventuid;
    this.event = await this.eventService.findByUid(this.event_uid);

    const rolesMap = await this.loginService.user.eventRolesMap;
    rolesMap ? (this.role = rolesMap.get(this.event_uid)) : (this.role = 0);
    this.event.role = this.role;

    let query: Query = this.afs.collection<Imagen>('img').ref;
    query = query.where('event_uid', '==', this.event.uid);

    console.log(this.event);

    if (this.event.role < 2) {
      query = query.where('isVip', '==', false);
    }
    this.images = this.afs
      .collection<Imagen>('img', ref => query)
      .valueChanges();
  }

  toggleVip(imagen: Imagen) {
    this.imgRef.ref
      .where('url', '==', imagen.url)
      .get()
      .then((result: any) => {
        return this.imgRef
          .doc(result.docs[0].id)
          .update({ isVip: !imagen.isVip });
      })
      .then(() => {
        console.log('updated permission');
      })
      .catch(err => {});
  }

  deleteImage(image: Imagen) {
    this.imageService
      .deleteImage(image)
      .then(() => {
        this.toastService.success('imagen eliminada correctamente');
      })
      .catch(err => {
        console.log(err);

        this.toastService.error('ha habido un error');
      });
  }

  downloadAsZip() {
    this.downloader.downloadImagesAsZip(this.event);
  }
}
