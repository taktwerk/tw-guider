
import {Pipe, PipeTransform} from '@angular/core';
import {TranslateConfigService} from '../services/translate-config.service';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {

    constructor(private translateConfigService: TranslateConfigService) {
        //
    }

    async transform(value: any, args?: any): Promise<any> {
        if (!value) {
            return value;
        }
        const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
        if (seconds < 29) {
            return await this.translateConfigService.translate('date.ago.just_now');
        }
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        let counter;
        for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0) {
                const periodAgoTranslateKey = (counter === 1) ? `date.ago.${i}` : `date.ago.${i + 's'}`;

                const dateAgo = await this.translateConfigService.translate(periodAgoTranslateKey, {counter});
                console.log('dateAgo', dateAgo);
                return dateAgo;
            }
        }

        return value;
    }
}
