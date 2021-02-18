import { } from "selenium-webdriver/http";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class HttpGenericCrudService<T > {
    private _token: string = localStorage.getItem('auth_token');

    constructor(
        protected httpClient: HttpClient,
        private apiUrl: string,
        private endPoint: string
    ) { }

    protected getCommonOptions() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._token}`,
                
            })
        };
        return httpOptions;
    }


  
    /*
     * This is error processing and handling
     */
    protected handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned error code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }

    /*
     * This is the standard setup for http posts
     */
    public AddEntity(entity: T): Observable<T> {
        return this.httpClient.post<T>(`${this.endPoint}`, entity, this.getCommonOptions())
            .pipe(map((data) => data, catchError(this.handleError)
            ));
    }

    /*
     * This is the standard setup for http puts
     */
    public UpdateEntity(entity: T): Observable<T> {
        return this.httpClient.put<T>(`${this.endPoint}`, entity, this.getCommonOptions()).
            pipe(map((data) => data));
    }


    /*
     * This is the setup for returning observable by Id
     */
    public GetById(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/${id}`, this.getCommonOptions());
    }

    /*
     * This is the setup for returning all observables at an endpoint
     */ 
    public GetAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.endPoint}`, this.getCommonOptions());
    }

    /*
     * This is the standard setup for http delete 
     */ 
    public DeleteEntity(id: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${id}`, this.getCommonOptions());
    }

}
