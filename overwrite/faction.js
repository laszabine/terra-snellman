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

showActiveGames_ = showActiveGames;
showActiveGames = function(games, div, mode, status) {

  showActiveGames_(games, div, mode, status);

  games.each(function(elem) {
    console.log('game', elem);

    if (elem.action_required && elem.action_required == 1) {
      console.log('sending move notification', elem.id);
      sendMoveNotification(elem.id, elem.link);
    } else {
      console.log('removing move notification', elem.id);
      clearMoveNotification(elem.id, elem.link);
    }

    if (elem.unread_chat_messages && elem.unread_chat_messages > 0) {
      console.log('sending chat notification', elem.id);
      sendChatNotification(elem.id, elem.link);
    } else {
      console.log('removing chat notification', elem.id);
      clearChatNotification(elem.id, elem.link);
    }
  });
}
