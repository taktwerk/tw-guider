import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import defaultLanguageObject from './../assets/i18n/en.json';
import germanyLanguageObject from './../assets/i18n/de.json';

@Injectable({
    providedIn: 'root'
})
export class TranslateConfigService {

    static AVAILABLE_LANGUAGES = {
        en: defaultLanguageObject,
        de: germanyLanguageObject
    };

    static DEFAULT_LANGUAGE: string;

    constructor(
        private translator: TranslateService
    ) {
        TranslateConfigService.DEFAULT_LANGUAGE = this.getDeviceLanguage();
        console.log(TranslateConfigService.DEFAULT_LANGUAGE, "TranslateConfigService.DEFAULT_LANGUAGE")
    }

    getDefaultLanguage() {
        if (this.translator.currentLang && this.isLanguageAvailable(this.translator.currentLang)) {
            return this.translator.currentLang;
        }
        let language = this.translator.getBrowserLang();
        if (!this.isLanguageAvailable(language)) {
            language = TranslateConfigService.DEFAULT_LANGUAGE;
        }
        this.setLanguage(language);

        return language;
    }

    setLanguage(setLang?: string) {
        console.log("setLang", setLang)
        if (!setLang || !this.isLanguageAvailable(setLang)) {
            setLang = TranslateConfigService.DEFAULT_LANGUAGE;
        }
        this.translator.use(setLang);
        this.translator.setTranslation(setLang, TranslateConfigService.AVAILABLE_LANGUAGES[setLang]);
        this.translator.setDefaultLang(setLang);
    }

    isLanguageAvailable(language) {
        return Object.keys(TranslateConfigService.AVAILABLE_LANGUAGES).includes(language);
    }

    translateWord(key): string {
        return this.translator.instant(key);
    }

    translate<T extends string | string[]>(key: string | Array<string>, interpolateParams?: Object): Promise<string> {
        return new Promise<any>((resolve => {
            this.translator.get(key, interpolateParams).toPromise().then((result) => {
                resolve(result);
            });
        }));
    }

    onLangChange() {
        return this.translator.onLangChange;
    }

    getDeviceLanguage() {
        const deviceLang = navigator.language.split("-")[0]
        const osLang = TranslateConfigService.AVAILABLE_LANGUAGES[deviceLang];
        if (osLang) {
            return deviceLang;
        }
        return 'en';
    }
}
