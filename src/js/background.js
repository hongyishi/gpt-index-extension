chrome.windows.onFocusChanged.addListener((windowId) => {
    console.log('On focus change: ' + windowId);
    handleActiveTab();
});

chrome.tabs.onActivated.addListener((e) => {
    console.log('On activated', e);
    handleActiveTab();
});
chrome.tabs.onUpdated.addListener((e) => {
    console.log('On updated', e);
    handleActiveTab();
});

const handleActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true, lastFocusedWindow: true }, function (tabs) {
        if (tabs[0]) {
            chrome.windows.get(tabs[0].windowId, (w) => {
                if (w && w.focused) {
                    currentUrl = tabs[0].url;
                    console.log('ACTIVE TAB -> ' + tabs[0].url);
                } else {
                    console.log('ACTIVE TAB WITHOUT FOCUS -> ' + tabs[0].url);
                }
            });
        } else {
            console.log('NO ACTIVE TAB');
        }
    });
};

var currentUrl;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.request === "url")
        sendResponse({response: currentUrl});
    }
  );