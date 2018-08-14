import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FileItem } from '../../models/file-items';
import { ImageUploaderService } from '../../services/image-uploader.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: []
})
export class UploaderComponent {
  overDrop = false;

  files: FileItem[] = [];

  event_uid: string;

  constructor(
    public uploaderService: ImageUploaderService,
    private activatedRoute: ActivatedRoute
  ) {
    this.event_uid = this.activatedRoute.snapshot.params['uid'];
    console.log(this.event_uid);
  }

  cargarImagenes() {
    this.uploaderService.uploadToFirebase(this.files, this.event_uid);
  }

  limpiarArchivos() {
    this.files = [];
  }
}
