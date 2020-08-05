
// receive a message from the webpage
window.addEventListener("message", function(event) {
  if (event.source == window &&
      event.data) {
    console.log("message during content-script: ", event.data);

    // send a message to the background script
    browser.runtime.sendMessage(event.data);
  }
});
