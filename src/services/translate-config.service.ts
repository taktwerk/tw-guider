import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class TranslateConfigService {

    static AVAILABLE_LANGUAGES: string[] = [
        'en',
        'de'
    ];

    static DEFAULT_LANGUAGE: string = 'en';

    constructor(
        private translate: TranslateService
    ) {}

    getDefaultLanguage() {
        //// TODO save to database in user setting and get first of all from database
        if (this.translate.currentLang && this.isLanguageAvailable(this.translate.currentLang)) {
            return this.translate.currentLang;
        }
        let language = this.translate.getBrowserLang();
        if (!this.isLanguageAvailable(language)) {
            language = TranslateConfigService.DEFAULT_LANGUAGE;
        }
        this.translate.setDefaultLang(language);

        return language;
    }

    setLanguage(setLang) {
        if (!this.isLanguageAvailable(setLang)) {
            setLang = TranslateConfigService.DEFAULT_LANGUAGE;
        }
        this.translate.use(setLang);
    }

    isLanguageAvailable(language) {
        return TranslateConfigService.AVAILABLE_LANGUAGES.includes(language);
    }
}
