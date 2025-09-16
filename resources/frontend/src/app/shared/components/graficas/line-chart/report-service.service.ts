import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  private readonly URL = environment.base_url;
  private readonly URL_REPORTE = this.URL+"/reporte-general";

  constructor(private httpClient:HttpClient) {
  }

  getData$(payload):Observable<any>{

    return this.httpClient.get<any>(this.URL_REPORTE, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
