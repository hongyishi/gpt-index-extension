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
            last_tab_id = tabs[0].id;
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
      })
};

var currentUrl;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.request === "url")
            sendResponse({ response: currentUrl });

        if (request.request === "update") {
            chrome.tabs.update({ url: request.requestUrl });
        }
        if (request.request === "highlight") {
            console.log("highlight: " + last_tab_id);
            text_refs = request.text_refs;
            console.log("text_refs: ");
            console.log(text_refs);
            for (let i = 0; i < text_refs.length; i++) {
                index = text_refs[i];
                console.log("source text: ");
                console.log(index["source_text"]);
                chrome.tabs.sendMessage(last_tab_id, 
                    { 
                        message: "highlight", 
                        sourceText: index["source_text"]
                    }, function(response) {});
            }
        }
    }
);

var last_tab_id;