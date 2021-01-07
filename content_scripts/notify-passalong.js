
// receive a message from the webpage
console.log('adding event listener for messages');
window.addEventListener("message", function(event) {
  //console.log('received a message');
  if (event.source == window &&
      event.data) {
    console.log("message during content-script: ", event.data);
    console.log(event.data);

    
    //console.log(browser);
    //let getting = await browser.storage.local.get(["notifyTurnStr", "notifyChatStr"]); 
    //console.log(getting);    
    let getting = browser.storage.local.get(["notifyTurnStr", "notifyChatStr"]); 
    getting.then(
      (result) => {
        if (!event.data.type) {
          return; 
        }
        switch (event.data.type) {
          case "move": 
            if (result.notifyTurnStr == "true") {
              console.log('sending move message because this is enabled');
              // send a message to the background script
              browser.runtime.sendMessage(event.data);
            } else {
              console.log('not sending move message because this is disabled');
            }
            break;
          case "chat": 
            if (result.notifyChatStr == "true") {
              console.log('sending chat message because this is enabled');
              // send a message to the background script
              browser.runtime.sendMessage(event.data);
            } else {
              console.log('not sending chat message because this is disabled');
            }
            break;
          default: 
            console.log('unexpected message type', event.data.type);
            break;
        }
      }, 
      (error) => {
        console.log(error);
      }
    ); 
    // send a message to the background script
    //browser.runtime.sendMessage(event.data);
  }
});
console.log('added event listener for messages');
