import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe as BaseDatePipe} from '@angular/common';
import {TranslateConfigService} from '../../services/translate-config.service';
import dateFormats from '../../assets/i18n/dateFormat.json';

@Pipe({ name: 'datePipe'})
export class DatePipe extends BaseDatePipe implements PipeTransform {

    constructor(private translateConfigService: TranslateConfigService) {
        super('en-US');
    }

    transform(value: any, format?: string, timezone?: string, locale?: string): string | null {
        const language = this.translateConfigService.getDefaultLanguage();
        console.log('dateFormats', dateFormats);
        const dateFormatsByLanguage = dateFormats[language];
        console.log('language', language);
        console.log('dateFormatsByLanguage', dateFormatsByLanguage);
        if (dateFormatsByLanguage) {
            const languageFormat = dateFormatsByLanguage[format];
            console.log('languageFormat', languageFormat);
            if (languageFormat) {
                format = languageFormat;
            }
        }

        return super.transform(value, format, timezone, locale);
    }
}
