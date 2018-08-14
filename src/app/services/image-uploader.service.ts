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
    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.estaSubiendo = true;

      if (item.progreso >= 100) {
        continue;
      }

      const refImagen = storageRef.child(
        `${this.CARPETA_IMAGENES}/${item.nombreArchivo}`
      );
      const uploadTask: firebase.storage.UploadTask = refImagen.put(
        item.archivo
      );

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          (item.progreso =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        error => {
          this.toastService.error('Error al subir imagenes');
          console.error(error);
        },
        () => {
          refImagen.getDownloadURL().then(urlImagen => {
            this.toastService.success('Imagen cargada correctamente');
            item.url = urlImagen;
            item.estaSubiendo = false;
            this.guardarImagen({
              nombre: item.nombreArchivo,
              url: item.url,
              event_uid: event_uid
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
