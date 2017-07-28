const port = chrome.runtime.connect(chrome.runtime.id);

port.onMessage.addListener((msg: IMessage) => {
    console.log('port received message: %s', msg.type);
    window.postMessage(msg, '*');
});

window.addEventListener('message', (event) => {
    console.log('window received message: %s', event.data.type);
    if (event.source !== window) return;

    if (event.data.type && (event.data.type === 'SS_UI_REQUEST' || event.data.type === 'SS_UI_CANCEL')) {
        port.postMessage(event.data)
    }
});

window.postMessage({type: 'SS_PING', text: 'start'}, '*');
