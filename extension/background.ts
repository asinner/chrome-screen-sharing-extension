const dataSources = [
    'screen', 'window'
];

let requestId: number;

interface IMessage {
    type: string;
    url: string;
    streamId: string;
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg: IMessage) => {
        if (msg.type === 'SS_UI_REQUEST') {
            requestScreenSharing(port, msg);
        }
        if (msg.type === 'SS_UI_CANCEL') {
            cancelScreenSharing(msg);
        }
    })
});

function requestScreenSharing(port: chrome.runtime.Port, msg: IMessage) {
    let tab: chrome.tabs.Tab | undefined;
    if (!port.sender) {
        return;
    }
    if (port.sender) {
        tab = port.sender.tab;
    }

    if (tab) {
        tab.url = msg.url;
        requestId = chrome.desktopCapture.chooseDesktopMedia(dataSources, tab, (streamId) => {
            if (streamId) {
                msg.type = 'SS_DIALOG_SUCCESS';
                msg.streamId = streamId;
            } else {
                msg.type = 'SS_DIALOG_CANCEL';
            }
            port.postMessage(msg);
        });
    }
}

function cancelScreenSharing(msg: IMessage) {
    if (requestId) {
        chrome.desktopCapture.cancelChooseDesktopMedia(requestId)
    }
}


chrome.windows.getAll({
    populate: true
}, (windows) => {
    const details = {
        file: 'content-script.js', allFrames: true
    }
    let currentWindow;

    windows.forEach(w => {
        if (!w.tabs) return;
        w.tabs.forEach(t => {
            if (t.url) {
                if (!t.url.match(/(chrome):\/\//gi)) {
                    if (t.id) {
                        chrome.tabs.executeScript(t.id, details, () => {
                            console.log('injectedScript');
                        });
                    }
                }
            }
        });
    });
});