import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';

import { Imagen } from '../interfaces/image.interface';
import { FileItem } from '../models/file-items';

@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService {
  private CARPETA_IMAGENES = 'img';

  constructor(
    private db: AngularFirestore,
    private toastService: ToastrService
  ) {}

  uploadToFirebase(imagenes: FileItem[], event_uid: string) {
    console.log(imagenes);

    const storageRef = firebase.storage().ref();

    for (const image of imagenes) {
      image.estaSubiendo = true;

      if (image.progreso >= 100) {
        continue;
      }

      const refImagen = storageRef.child(
        `${this.CARPETA_IMAGENES}/${image.nombreArchivo}`
      );
      const uploadTask: firebase.storage.UploadTask = refImagen.put(
        image.archivo
      );

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          image.progreso =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          this.toastService.error('Error al subir imagenes');
          console.error(error);
        },
        () => {
          refImagen.getDownloadURL().then(urlImagen => {
            this.toastService.success('Imagen cargada correctamente');

            image.url = urlImagen;

            image.estaSubiendo = false;

            this.guardarImagen({
              nombre: image.nombreArchivo,
              url: image.url,
              event_uid: event_uid,
              isVip: image.isVip
            });
          });
        }
      );
    }
  }

  private guardarImagen(imagen: Imagen) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
  }
}
