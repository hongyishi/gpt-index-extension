window.onload = function () {
    document.getElementById("index-button").addEventListener("click", indexWebPage);
    document.getElementById("query-button").addEventListener("click", sendQuery);
    chrome.storage.local.get(["query_response"]).then((result) => {
        console.log("Value currently is " + result.query_response);
        document.getElementById("query-results").innerHTML = result.query_response;
      });
}

// index web page
function indexWebPage() {
    console.log("index web page");

    // // Get user's OpenAI API key
    var apiKey = document.getElementById("api-key-input").value;
    // if (apiKey == "") {
    //     alert("Please enter your OpenAI API key");
    //     return;
    // }
    (async () => {
        const response = await chrome.runtime.sendMessage({ request: "url" });
        // do something with response here, not outside the function
        console.log(response.response);
        var currentUrl = response.response;
        // Send a request to the server to check if the web page has already been indexed
        $.ajax({
            url: "http://gptindexextensionserver-env.eba-ssmvy7mt.us-west-2.elasticbeanstalk.com/check-index",
            type: "POST",
            data: JSON.stringify({
                url: currentUrl,
                apiKey: apiKey
            }),
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                if (response === "True") {
                    // Show query prompt
                    document.getElementById("query-prompt").style.display = "block";
                } else {
                    // Send request to index web page
                    $.ajax({
                        url: "http://gptindexextensionserver-env.eba-ssmvy7mt.us-west-2.elasticbeanstalk.com/index-webpage",
                        type: "POST",
                        data: JSON.stringify({
                            url: currentUrl,
                            apiKey: apiKey
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        success: function (response) {
                            if (response === "done") {
                                // Show query prompt
                                document.getElementById("query-prompt").style.display = "block";
                            } else {
                                alert("Error indexing web page, please try again.");
                            }
                        },
                        error: function (error) {
                            alert("Error indexing web page, please try again.");
                        }
                    });
                }
            },
            error: function (error) {
                alert("Error checking index status, please try again.");
            }
        });

    })();

}

// Send query to server
function sendQuery() {
    console.log("send query");

    // Get user's OpenAI API key
    var apiKey = document.getElementById("api-key-input").value;
    // if (apiKey == "") {
    //     alert("Please enter your OpenAI API key");
    //     return;
    // }
    (async () => {
        const response = await chrome.runtime.sendMessage({ request: "url" });
        // do something with response here, not outside the function
        console.log(response.response);
        var currentUrl = response.response;
        var query = document.getElementById("query-input").value;
        document.getElementById("query-results").innerHTML = "Querying...";
        $.ajax({
            url: "http://gptindexextensionserver-env.eba-ssmvy7mt.us-west-2.elasticbeanstalk.com/query",
            type: "POST",
            data: JSON.stringify({
                url: currentUrl,
                query: query,
                apiKey: apiKey
            }),
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                console.log("query success response: " + response);
                // Display query results
                document.getElementById("query-results").innerHTML = response;
                chrome.storage.local.set({ query_response: response }).then(() => {
                    console.log("Value is set to " + response);
                  });
                  
            },
            error: function (error) {
                alert("Error querying indexed web page, please try again.");
            }
        });
    })();
}