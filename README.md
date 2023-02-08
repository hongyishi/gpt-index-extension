# gpt-index-extension
GPT Index Extension for Google Chrome

To use: 
1. Download this repo as a ZIP file from GitHub.
2. Unzip the file and you should have a folder named gpt-index-extension.
3. In Chrome go to the extensions page (chrome://extensions).
4. Enable Developer Mode.
5. Click on Load Unpacked and choose the extension folder.

This extension asks for your OpenAI API key to use during webpage indexing and querying. Specifically it's only passed into the LangChain function call and never stored server side. You can also leave the API field blank and it will use mine, but please don't abuse or I will remove that feature.
