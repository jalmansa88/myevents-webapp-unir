import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) {

  }

  downloadImage(url: string): Observable<Blob> {
    // const options = new RequestOptions({ responseType: ResponseContentType.Blob });

    return this.http.get(url, {})
      .pipe(map((res: any) => res.blob()));
  }
}
