function makeGameUrl(url) {
  return "https://terra.snellman.net" + url;
}

function sendNotification(data) {
  if (data.id && data.url && data.message) {
    // send message to content script
    window.postMessage({
      task: "create",
      id: data.id,
      url: makeGameUrl(data.url),
      title: "Terra Mystica",
      message: data.message,
    }, "https://terra.snellman.net");
  } else {
    console.error("Received invalid object", data);
  }
}

function sendMoveNotification(gameId, gameUrl) {
  sendNotification({
    id: gameId + "_move",
    url: gameUrl,
    message: "It's your turn to move in '" + gameId + "'"
  });
}

function sendChatNotification(gameId, gameUrl) {
  sendNotification({
    id: gameId + "_chat",
    url: gameUrl,
    message: "You have unread chat messages in '" + gameId + "'"
  })
}

function clearNotification(data) {
  if (data.url) {
    // send message to content script
    window.postMessage({
      task: "clear",
      id: data.id,
      url: makeGameUrl(data.url)
    }, "https://terra.snellman.net");
  } else {
    console.error("Received invalid object", data);
  }
}

function clearMoveNotification(gameId, gameUrl) {
  clearNotification({
    id: gameId + "_move",
    url: gameUrl
  });
}

function clearChatNotification(gameId, gameUrl) {
  clearNotification({
    id: gameId + "_chat",
    url: gameUrl
  });
}
