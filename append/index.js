
listGames_ = listGames
listGames = function(games, div, mode, status) {

  listGames_(games, div, mode, status);

  games.each(function(elem) {
    if (mode == "user") {
      if (!elem.dropped && !elem.aborted && elem.action_required) {
        sendMoveNotification(elem.id, elem.link);
      } else {
        clearMoveNotification(elem.id, elem.link);
      }
      if (elem.unread_chat_messages > 0) {
        sendChatNotification(elem.id, elem.link);
      } else {
        clearMoveNotification(elem.id, elem.link);
      }
    }
  });

}
