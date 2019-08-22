class Action {
  constructor(gameId, playerId, timestamp = Date.now()) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.timestamp = timestamp;
  }
}

class TokenAction extends Action {
  constructor(tokens, discardedTokens, ...args) {
    super(...args);
    this.tokens = tokens;
    this.discardedTokens = discardedTokens;

    // if (this.tokens.total() > 3)
    // throw new Error("No more than 3 tokens can be drawn");
    // if (this.tokens.total() === 3 && this.tokens.max() !== 1)
    // throw new Error("Only 1 per color can be drawn when drawing 3 tokens");
  }

  apply(game) {
    const player = game.getPlayerById(this.playerId);
    if (game.hasTokens(this.tokens)) {
      // TODO: Check for remaining pool for 2 token draws
      game.removeTokens(this.tokens);
      player.addTokens(this.tokens);
      return `${player.name} drew ${this.tokens} tokens`;
    }
    if (!this.discardedTokens.isEmpty()) {
      player.removeTokens(this.discardedTokens);
      game.addTokens(this.discardedTokens);
      return `${player.name} discarded ${this.discardedTokens} tokens`;
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
        return `${player.name} bought a card from the market`;
      }
    } else if (player.reservedCards.includes(card)) {
      if (player.canAfford(card)) {
        player.boughtCards.push(card);
        player.reservedCards.splice(player.reservedCards.indexOf(card));
        return `${player.name} bought a card from their reserve`;
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

    return `${player.name} reserved a card`;
  }
}

class PassAction extends Action {
  apply(game) {
    const player = game.getPlayerById(this.playerId);
    return `${player.name} passed their turn`;
  }
}

module.exports = { Action, BuyAction, PassAction, ReserveAction, TokenAction };
