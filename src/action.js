function message(msg) {
  return {
    message: msg
  };
}

function error(err, msg) {
  return {
    error: err,
    message: msg
  };
}

class Action {
  constructor(gameId, playerId, timestamp = Date.now()) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.timestamp = timestamp;
  }

  apply() {
    return {
      error: "empty action"
    };
  }
}

class TokenAction extends Action {
  constructor(tokens, discardedTokens, ...args) {
    super(...args);
    this.tokens = tokens;
    this.discardedTokens = discardedTokens;
  }

  apply(game) {
    const player = game.getPlayerById(this.playerId);
    if (this.tokens.total() > 3)
      return error("No more than 3 tokens can be drawn");
    if (this.tokens.total() === 3 && this.tokens.max() !== 1)
      return error("Only 1 per color can be drawn when drawing 3 tokens");
    if (game.hasTokens(this.tokens)) {
      // TODO: Check for remaining pool for 2 token draws
      game.removeTokens(this.tokens);
      player.addTokens(this.tokens);
      return message(`${player.name} drew ${this.tokens} tokens`);
    }
    if (!this.discardedTokens.isEmpty()) {
      player.removeTokens(this.discardedTokens);
      game.addTokens(this.discardedTokens);
      return message(`${player.name} discarded ${this.discardedTokens} tokens`);
    }
  }
}

class BuyAction extends Action {
  constructor(id, ...args) {
    super(...args);
    this.cardId = id;
    // card = card;
  }

  apply(game) {
    const player = game.getPlayerById(this.playerId);
    const card = game.getCardById(this.cardId);
    if (game.market.includes(card)) {
      if (player.canAfford(card)) {
        player.boughtCards.push(card);
        game.market.splice(game.market.indexOf(card));
        return message(`${player.name} bought a card from the market`);
      }
    } else if (player.reservedCards.includes(card)) {
      if (player.canAfford(card)) {
        player.boughtCards.push(card);
        player.reservedCards.splice(player.reservedCards.indexOf(card));
        return message(`${player.name} bought a card from their reserve`);
      }
    }
  }
}

class ReserveAction extends Action {
  // TODO: Extend for reserving from deck
  constructor(id, ...args) {
    super(...args);
    this.cardId = id;
  }

  apply(game) {
    const player = game.getPlayerById(this.playerId);
    const card = game.getCardById(this.cardId);
    if (game.market.includes(card)) {
      if (player.reservedCards.length < 3) {
        player.reservedCards.push(card);
        game.market.splice(game.market.indexOf(card));
      }
    }

    return message(`${player.name} reserved a card`);
  }
}

class PassAction extends Action {
  apply(game) {
    const player = game.getPlayerById(this.playerId);
    return message(`${player.name} passed their turn`);
  }
}

module.exports = { Action, BuyAction, PassAction, ReserveAction, TokenAction };
