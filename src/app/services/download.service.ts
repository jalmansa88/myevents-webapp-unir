import { Injectable } from '@angular/core';
import { Query } from '@firebase/firestore-types';
import { AngularFirestore } from 'angularfire2/firestore';
import { saveAs } from 'file-saver/FileSaver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

import { Imagen } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private afs: AngularFirestore) {}

  downloadImagesAsZip(event: any) {
    console.log(event);

    const zip = new JSZip();
    const zipFilename = `imagenesEvento_${event.name}.zip`;
    let i = 0;

    let query: Query = this.afs.collection<Imagen>('img').ref;

    query = query.where('event_uid', '==', event.uid);

    if (event.role < 2) {
      query = query.where('isVip', '==', false);
    }

    query.get().then(imagenes => {
      imagenes.docs.forEach(imagen => {
        JSZipUtils.getBinaryContent(imagen.data().url, (err, data) => {
          if (err) {
            console.error(err);

            throw err;
          }

          zip.file(imagen.data().nombre, data, { binary: true });
          i++;

          if (i === imagenes.docs.length) {
            zip
              .generateAsync({ type: 'blob' })
              .then(result => {
                console.log('result', result);

                saveAs(result, zipFilename);
              })
              .catch(error => {
                console.error(error);
              });
          }
        });
      });
    });
  }
}
