function saveOptions(e) {
    console.log('saving options');
    e.preventDefault();
    console.log(e); 
    console.log(document);
    browser.storage.local.set({
      //timeoutStr: document.querySelector("#timeout").value, 
      notifyTurnStr: document.querySelector("#notifyTurn").checked.toString(), 
      notifyChatStr: document.querySelector("#notifyChat").checked.toString(), 
    });
  }
  
  function restoreOptions() {

    console.log('restoring options');
  
    function setCurrentChoice(result) {
      console.log(result); 
      //document.querySelector("#timeout").value = result.timeoutStr;
      document.querySelector("#notifyTurn").checked = result.notifyTurnStr == "true"; 
      document.querySelector("#notifyChat").checked = result.notifyChatStr == "true"; 
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    let getting = browser.storage.local.get({
      //timeoutStr: (5*60).toString(), 
      notifyTurnStr: "true", 
      notifyChatStr: "true"
    });
    getting.then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  