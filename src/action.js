class Action {
  constructor(gameId, player, timestamp) {
    this.gameId = gameId;
    this.player = player;
    this.timestamp = timestamp;
  }
}

class TokenAction extends Action {
  constructor(gameId, player, timestamp, tokens, discardedTokens) {
    super(gameId, player, timestamp);
    this.tokens = tokens;
    this.discardedTokens = discardedTokens;
  }

  apply(game) {
    player.tokens();
  }
}

class BuyAction extends Action {
  constructor(gameId, player, timestamp, card) {
    super(gameId, player, timestamp);
    this.card = card;
  }
}

class ReserveAction extends Action {
  constructor(gameId, player, timestamp, card) {
    super(gameId, player, timestamp);
    this.card = card;
  }
}

class PassAction extends Action {
  constructor(gameId, player, timestamp) {
    super(gameId, player, timestamp);
  }
}

module.exports = { Action, BuyAction, PassAction, ReserveAction, TokenAction };
