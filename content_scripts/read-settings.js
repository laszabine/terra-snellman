window.addEventListener("message", function(event) {
    if (event.source == window &&
        event.data &&
        event.data.task == "timeout-request") 
    {
        console.log("received a message from site script", event.data);
        // read browser storage for current value
        
        let getting = browser.storage.local.get({
            timeoutStr: 5*60, // TODO: default value should be stored at a single location only
        }); 
        getting.then(
            (result) => {
                window.postMessage({
                    task: "timeout-response", 
                    timeout_sec: parseInt(result.timeoutStr)
                }, "*");
            }, 
            (error) => {
                console.log(error);
            }
        );
        
       /*
       let result = await browser.storage.local.get(["timeoutStr"]); 
       console.log(result);
       window.postMessage({
                task: "timeout-response", 
                timeout_sec: parseInt(result.timeoutStr)
            }, "*"
        );
        */ 
    }
});