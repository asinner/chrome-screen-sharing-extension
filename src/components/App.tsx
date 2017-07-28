import '../index.scss';
import * as React from 'react';

export class App extends React.Component<{}, {}> {
    private hasExtension: boolean = false;

    constructor() {
        super()
        this.onShareScreen = this.onShareScreen.bind(this)
        this.state = {}

        window.addEventListener('message', this.onWindowMessage.bind(this));
    }

    private onWindowMessage(event: MessageEvent) {
        if (event.origin != window.location.origin || !event.data.type) {
            return;
        }
        this.handleWindowMessage(event.data);
    }

    private handleWindowMessage(data: {type: string, streamId: string}) {
        switch (data.type) {
            case 'SS_PING':
                this.hasExtension = true;
                break;
            case 'SS_DIALOG_SUCCESS':
                this.startStream(data.streamId)
                break;
        }
    }

    private startStream(streamId: string) {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height,
                }
            }
        }, (stream: MediaStream) => {
            (this.refs.video as HTMLVideoElement).src = URL.createObjectURL(stream);
            (this.refs.video as HTMLVideoElement).play();
        }, (err: any) => {
            console.error('Failed to call webkitGetUserMedia. Error: %s', err);
        })
    }

    private onShareScreen() {
        if (!this.hasExtension) {
            alert('Extension not found.')
            return;
        }
        window.postMessage({type: 'SS_UI_REQUEST', text: 'start', url: location.origin}, '*');
    }

    render() {
        return (
            <div className='screen-sharing-example'>
                <h1>Screen sharing example</h1>
                <video autoPlay={true} ref='video'></video>
                <button type='button' onClick={this.onShareScreen}>
                    Share
                </button>
            </div>
        );
    }
}
