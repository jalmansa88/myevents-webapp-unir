import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FileItem } from '../../models/file-items';
import { ImageUploaderService } from '../../services/image-uploader.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: []
})
export class UploaderComponent {
  @Input()
  event_uid: string;

  overDrop = false;
  files: FileItem[] = [];

  constructor(
    public uploaderService: ImageUploaderService,
    private activatedRoute: ActivatedRoute
  ) {
    // this.event_uid = this.activatedRoute.snapshot.params['uid'];
    console.log(this.event_uid);
  }

  cargarImagenes() {
    this.uploaderService.uploadToFirebase(this.files, this.event_uid);
  }

  limpiarArchivos() {
    this.files = [];
  }
}
