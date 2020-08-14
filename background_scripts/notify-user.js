
async function displayNotification(message) {
  console.log('received message', message);
  // we use the URL of the webpage of the game as notification ID
  // so that we will be able to know the URL when the notification is clicked
  let myId = message.id;
  switch (message.task) {
    case "create":
      let activeNotifications = await browser.notifications.getAll();
      console.log('active notifications', activeNotifications);
      if (Object.keys(activeNotifications).indexOf(myId) == -1) {
        console.log("creating notification with id=", myId);
        browser.notifications.create(myId, {
            type: "basic",
            title: message.title,
            message: message.message,
            iconUrl: "https://terra.snellman.net/favicon.ico"
          }
        );
      } else {
        console.log('notification with id='+myId+' already exists');
      }
      break;
    case "clear":
      console.log("Deleting notification with id=", myId);
      browser.notifications.clear(myId);
      break;
    default:
      console.warn("Received unintelligible message", message);
      break;
  }
}

// receive a message from the content script
browser.runtime.onMessage.addListener(displayNotification);

// async function afterNotificationClicked(notificationId) {
//   if (notificationId.startsWith("https://terra.snellman.net/")) {
//     console.log("opening url", notificationId);
//     // open the URL that is passed as notification ID
//     let newWindow = window.open(notificationId);
//     newWindow.focus();
//   }
// }

// browser.notifications.onClicked.addListener(afterNotificationClicked);
