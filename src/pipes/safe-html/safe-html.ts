import { DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    limit = 38;

    transform(value: string, slice?: boolean) {
        // get the innerhtml value of the first element 
        // return the value with slicing
        // use css to slice to add elipsis to the text
        // const unwanted = ['<th>', '<tr>', '<td>', '<li>', '<ol>', '<p>', '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>', '<blockquote>', '</th>', '</tr>', '</td>', '</li>', '</ol>', '</p>', '</h1>', '</h2>', '</h3>', '</h4>', '</h5>', '<h6>', '</blockquote>']
        if (slice) {
            // unwanted.map(u => value.replace(u, ''))
            console.log(this.sanitized.bypassSecurityTrustHtml(value))
            value = value.length >= this.limit ? value.slice(0, this.limit) + '...' : value.slice(0, 19);
            console.log(value)

            return value;
        }
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
