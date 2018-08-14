import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { FileItem } from '../models/file-items';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  @Input()
  files: FileItem[] = [];
  @Output()
  mouseOver: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseOver.emit(true);
    this.prevenirAbrirImagenNavegador(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transferencia = this.getTransferencia(event);

    if (!transferencia) {
      return;
    }

    this.extraerArchivosFromJsonToArray(transferencia.files);
    this.prevenirAbrirImagenNavegador(event);
    this.mouseOver.emit(false);
  }

  private getTransferencia(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private extraerArchivosFromJsonToArray(filesList: FileList) {
    // tslint:disable-next-line:forin
    for (const propiedad in Object.getOwnPropertyNames(filesList)) {
      const archivoTemporal = filesList[propiedad];

      if (this.archivoValido(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.files.push(nuevoArchivo);
      }
    }

    console.log(this.files);
  }

  private archivoValido(archivo: File): boolean {
    return !this.archivoYaExiste(archivo.name) && this.isImagen(archivo.type);
  }

  private prevenirAbrirImagenNavegador(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private archivoYaExiste(nombreArchivo: string): boolean {
    for (const archivo of this.files) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('el archivo ya fue agregado: ', archivo.nombreArchivo);
        return true;
      }
    }
    return false;
  }

  private isImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }
}
