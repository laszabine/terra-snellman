/* for the add-on preferences */ 

function saveOptions(e) {
    console.log('saving preferences');
    e.preventDefault();
    console.log(e); 

    // get the old value of timeoutStr
    let timeout_old; 
    let getting = browser.storage.local.get('timeoutStr');
    getting.then((result) => {

      // receive the old value
      timeout_old = result.timeoutStr;
      console.log("old timeout value", timeout_old, typeof timeout_old);

      // did the value change? 
      let timeout_new = document.querySelector("#timeout").value;
      console.log("new timeout value", timeout_new, typeof timeout_new);

      if (timeout_old != timeout_new) {

        console.log("sending timeout message because i'm saving preferences with a new value");

        // for the extension preferences
        console.log(window); // it doesn't work to send the message to this window 
        /*
        window.postMessage({
            task: "timeout-response", 
            timeout_sec: parseInt(timeout_new)
          }, "*");
        */
        window.postMessage({
          task: "timeout-request"
        }, "*");

        // for the pop-up
        /*
        let gettingCurrent = browser.windows.getCurrent(); // maybe get the active tab instead? 
        gettingCurrent.then((w) => {
          console.log(w);
          w.postMessage({
              task: "timeout-response", 
              timeout_sec: parseInt(timeout_new)
            }, "*"); 
        });
        */
      }

    }, (error) => {
      console.log(error);
    });

    // the following will happen while we wait for the answer from browser.storage.local.get

    // save the new values
    browser.storage.local.set({
      timeoutStr: document.querySelector("#timeout").value, 
      notifyTurnStr: document.querySelector("#notifyTurn").checked.toString(), 
      notifyChatStr: document.querySelector("#notifyChat").checked.toString(), 
    });

  }
  
  function restoreOptions() {

    console.log('restoring options');
  
    function setCurrentChoice(result) {
      console.log(result); 
      document.querySelector("#timeout").value = result.timeoutStr;
      document.querySelector("#notifyTurn").checked = result.notifyTurnStr == "true"; 
      document.querySelector("#notifyChat").checked = result.notifyChatStr == "true"; 
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    let getting = browser.storage.local.get({
      timeoutStr: (5*60).toString(), 
      notifyTurnStr: "true", 
      notifyChatStr: "true"
    });
    getting.then(setCurrentChoice, onError);
    
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  
/* for the pop up */
/*
function doSomething(e) {
  console.log('something was clicked', e);

  if (!e.target.classList.contains("preferences")) {
    return;
  }
}

document.addEventListener("click", doSomething);
*/