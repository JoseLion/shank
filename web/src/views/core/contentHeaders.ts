import { Headers } from '@angular/http';

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
contentHeaders.append('Access-Control-Allow-Headers', 'Content-Type,X-XSRF-TOKEN');
