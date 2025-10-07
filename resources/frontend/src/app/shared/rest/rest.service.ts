import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  url = `${environment.base_url}/`;
  private http_upload: HttpClient;
  constructor(private http: HttpClient) { }



  get(path, payload): Observable<any> {
    return this.http.get<any>(this.url + path, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  get_id(path, id, payload): Observable<any> {
    return this.http.get<any>(this.url + path + "/" + id, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  get_file(path, id): Observable<any> {
    return this.http.get<any>(this.url + path + "/" + id, { params: {}, responseType: 'blob' as 'json' }).pipe(
      map(response => {
        return response;
      })
    );

  }

  post_file(path: string, data: Record<string, any>, file: File): Observable<any> {
    
    /*const formData = new FormData();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    /*headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    formData.append('token', token);
    formData.append('Content-Type', "multipart/form-data");
    formData.append('catalogo_subtema_id', data.catalogo_subtema_id);
    formData.append('descripcion', data.descripcion);
    formData.append('id', data.id);
    formData.append('archivo', file, file.name);
    /*if( file instanceof File)
    {
    }*/
    /*const formData: FormData = new FormData();

    formData.append('archivo', file, file.name);


    //let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set(
      "Authorization",'Bearer '+localStorage.getItem("token"),
    );
    headers.append('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Access-Control-Allow-Origin','*');
    formData.append('catalogo_subtema_id', data.catalogo_subtema_id);
    formData.append('descripcion', data.descripcion);
    formData.append('id', data.id);
    formData.append('archivo', file, file.name);

    return this.http.post<any>(this.url + path, formData, { headers: headers });*/
    const formData: FormData = new FormData();

    formData.append('archivo', file, file.name);
    formData.append('catalogo_subtema_id', data.catalogo_subtema_id);
    formData.append('descripcion', data.descripcion);
    formData.append('semaforo', data.semaforo);
    formData.append('id', data.id);

    //let token = localStorage.getItem('token');
    // let headers = new HttpHeaders().set(
    //   "Authorization",'Bearer '+localStorage.getItem("token"),
    // );
    //headers.append('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
    //headers.append('Access-Control-Allow-Origin','*');
    return this.http.post(this.url + path, formData);
   
  }



  post(path, payload): Observable<any> {
    return this.http.post<any>(this.url + path, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  put(path, id, payload): Observable<any> {
    return this.http.put<any>(this.url + path + "/" + id, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  delete(path, id): Observable<any> {
    return this.http.delete<any>(this.url + path + "/" + id, {}).pipe(
      map(response => {
        return response;
      })
    );
  }

}
