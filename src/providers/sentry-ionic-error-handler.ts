import { ErrorHandler, Injectable } from '@angular/core';

import * as Sentry from 'sentry-cordova';

@Injectable()
export class SentryIonicErrorHandler extends ErrorHandler {
    handleError(error) {
        super.handleError(error);
        try {
            Sentry.captureException(error.originalError || error);
        } catch (e) {
            console.error(e);
        }
    }
}
