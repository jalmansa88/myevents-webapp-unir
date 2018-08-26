import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { DownloadService } from '../../download.service';
import { Imagen } from '../../interfaces/image.interface';
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

  ngOnInit() {
    if (!this.loginService.user) {
      this.router.navigate(['home']);
    }

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
      .then(result => {
        this.toastService.success('imagen eliminada correctamente');
      })
      .catch(err => {
        console.log(err);

        this.toastService.error('ha habido un error');
      });
  }
}
