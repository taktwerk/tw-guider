import { ErrorHandler, Injectable } from '@angular/core';

import * as Sentry from 'sentry-cordova';

@Injectable()
export class SentryIonicErrorHandler {
    errorHandler = new ErrorHandler;
    
    handleError(error) {
        this.errorHandler.handleError(error);
        try {
            Sentry.captureException(error.originalError || error);
        } catch (e) {
            console.error(e);
        }
    }
}
