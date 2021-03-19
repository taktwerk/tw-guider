import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as BaseDatePipe } from '@angular/common';
import { TranslateConfigService } from '../../services/translate-config.service';
import dateFormats from '../../assets/i18n/dateFormat.json';

@Pipe({ name: 'datePipe' })
export class DatePipe extends BaseDatePipe implements PipeTransform {

    constructor(private translateConfigService: TranslateConfigService) {
        super('en-US');
    }

    transform(value: any, format?: string, timezone?: string, locale?: string): string
    transform(value: any, format?: string, timezone?: string, locale?: string): null
    transform(value: any, format?: string, timezone?: string, locale?: string): string | null {
        const language = this.translateConfigService.getDefaultLanguage();
        const dateFormatsByLanguage = dateFormats[language];
        if (dateFormatsByLanguage && format) {
            const languageFormat = dateFormatsByLanguage[format];
            if (languageFormat) {
                format = languageFormat;
            }
        }

        return super.transform(value, format, timezone, locale);
    }

   
}
