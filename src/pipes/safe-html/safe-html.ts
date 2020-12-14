import { DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    limit = 19;

    transform(value: string, slice?: boolean) {
        // const unwanted = ['<th>', '<tr>', '<td>', '<li>', '<ol>', '<p>', '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>', '<blockquote>', '</th>', '</tr>', '</td>', '</li>', '</ol>', '</p>', '</h1>', '</h2>', '</h3>', '</h4>', '</h5>', '<h6>', '</blockquote>']
        if (slice) {
            // unwanted.map(u => value.replace(u, ''))
            value = value.length >= this.limit ? value.slice(0, 19) + '...' : value.slice(0, 19);

            return this.sanitized.bypassSecurityTrustHtml(value);
        }
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
