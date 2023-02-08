const highlightedMarkTemplate = document.createElement('mark');

function highlight(text) {
    TEXT_TEST_LENGTH = 20;
    NUM_OVERLAP_SUCCESS_THRESHOLD = 5;
    LEFT_GUARDRAIL = 0;

    nodeText = "";
    treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (nodeText.length < TEXT_TEST_LENGTH) {
        nodeText = treeWalker.nextNode().data;
    }
    // console.log(nodeText);
    innerHTML = document.body.innerHTML;

    LEFT_GUARDRAIL = innerHTML.indexOf(nodeText.slice(0, TEXT_TEST_LENGTH));
    // console.log("LEFT_GUARDRAIL: " + LEFT_GUARDRAIL);
    if (LEFT_GUARDRAIL < 0) {
        return;
    }

    docLength = text.length;

    startCounter = 0;
    posStartSum = 0;
    lastDocPos = 0;
    for (var i = 0; i < docLength - TEXT_TEST_LENGTH; i+=TEXT_TEST_LENGTH) {
        lastDocPos = i + TEXT_TEST_LENGTH;
        span = text.slice(i, i+TEXT_TEST_LENGTH);
        // console.log(span);
        index = innerHTML.indexOf(span);
        if (index > LEFT_GUARDRAIL && index != -1) {
            startCounter++;
            posStartSum += index;
        }
        if (startCounter >= NUM_OVERLAP_SUCCESS_THRESHOLD) {
            break;
        }
    }
    // console.log("startCounter: " + startCounter);
    // console.log("posStartSum: " + posStartSum);
    if (startCounter >= NUM_OVERLAP_SUCCESS_THRESHOLD) {
        startIndex = Math.floor(posStartSum/startCounter);

        endCounter = 0;
        posEndSum = 0;
        for (var i = docLength - TEXT_TEST_LENGTH; i > lastDocPos; i-=TEXT_TEST_LENGTH) {
            span = text.slice(i, i+TEXT_TEST_LENGTH);
            // console.log(span);
            index = innerHTML.indexOf(span);
            if (index > startIndex && index != -1) {
                endCounter++;
                posEndSum += index;
            }
            if (endCounter >= NUM_OVERLAP_SUCCESS_THRESHOLD) {
                break;
            }
        }
        // console.log("endCounter: " + endCounter);
        // console.log("posEndSum: " + posEndSum);
        if (endCounter >= NUM_OVERLAP_SUCCESS_THRESHOLD) {
            endIndex = Math.floor(posEndSum/endCounter);

            // find <br> in the document near startIndex and endIndex
            lineIndexStart = innerHTML.indexOf("<br>", startIndex);
            lineIndexEnd = innerHTML.indexOf("<br>", endIndex);
            // console.log("lineIndexStart: " + lineIndexStart);
            // console.log("lineIndexEnd: " + lineIndexEnd);
            // console.log("startIndex: " + startIndex);
            // console.log("endIndex: " + endIndex);
            if (lineIndexEnd - lineIndexStart < (endIndex - startIndex)/2) {
                index = startIndex;
                while (index < endIndex) {
                // find <p> in the document
                    lineIndexStart = innerHTML.indexOf("<p>", index) + "<p>".length;
                    lineIndexEnd = innerHTML.indexOf("</p>", lineIndexStart);
                    // console.log("lineIndexStart: " + lineIndexStart);
                    // console.log("lineIndexEnd: " + lineIndexEnd);
                    // console.log(innerHTML.substring(lineIndexStart, lineIndexEnd));
                    document.body.innerHTML = innerHTML.slice(0, lineIndexStart) + "<mark>" + innerHTML.substring(lineIndexStart, lineIndexEnd) + "</mark>" + innerHTML.substring(lineIndexEnd);   
                    innerHTML = document.body.innerHTML;
                    index = lineIndexEnd;
                }
            }
            else{ 
                // console.log("lineIndexStart: " + lineIndexStart);
                // console.log("lineIndexEnd: " + lineIndexEnd);
                document.body.innerHTML = innerHTML.slice(0, lineIndexStart) + "<mark>" + innerHTML.substring(lineIndexStart, lineIndexEnd) + "</mark>" + innerHTML.substring(lineIndexEnd);   
            }
            // console.log(document.body.innerHTML);
            document.querySelector("mark").scrollIntoView();
        }
    }
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "highlight") {
        console.log("highlight");
        highlight(request.sourceText);
      }
      return true;
    }
);