
showActiveGames_ = showActiveGames;
showActiveGames = function(games, div, mode, status) {

  showActiveGames_(games, div, mode, status);

  games.each(function(elem) {
    //console.log('game', elem);

    if (elem.action_required && elem.action_required == 1) {
      //console.log('sending move notification', elem.id);
      sendMoveNotification(elem.id, elem.link);
    } else {
      //console.log('removing move notification', elem.id);
      clearMoveNotification(elem.id, elem.link);
    }

    if (elem.unread_chat_messages && elem.unread_chat_messages > 0) {
      //console.log('sending chat notification', elem.id);
      sendChatNotification(elem.id, elem.link);
    } else {
      //console.log('removing chat notification', elem.id);
      clearChatNotification(elem.id, elem.link);
    }
  });
}
