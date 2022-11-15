import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';

/**
 * Download file class
 */
@Injectable()
export class AudioService {
    constructor(private media: Media) { }

    public file: MediaObject;

    setFile(fileUrl) {
        this.stop();
        this.file = this.media.create(fileUrl);
        // file.onStatusUpdate.subscribe(status => console.log(status));
        // file.onSuccess.subscribe(() => console.log('Action is successful'));
        //
        // file.onError.subscribe(error => console.log('Error!', error));
        //
        // // play the file
        // file.play();
    }

    play() {
        if (!this.file) {
            return;
        }

        this.file.play();
    }

    pause() {
        if (!this.file) {
            return;
        }

        this.file.pause();
    }

    stop() {
        if (!this.file) {
            return;
        }

        this.file.stop();
        this.file.release();
        this.file = null;
    }
}
