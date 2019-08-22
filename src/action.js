class Action {
  constructor(gameId, player, timestamp = Date.now()) {
    this.gameId = gameId;
    this.player = player;
    this.timestamp = timestamp;
  }
}

class TokenAction extends Action {
  constructor(tokens, discardedTokens, ...args) {
    super(...args);
    this.tokens = tokens;
    this.discardedTokens = discardedTokens;

    if (this.tokens.total() > 3)
      throw new Error("No more than 3 tokens can be drawn");
    if (this.tokens.total() === 3 && this.tokens.max() !== 1)
      throw new Error("Only 1 per color can be drawn when drawing 3 tokens");
  }

  apply(game) {
    if (game.hasTokens(this.tokens)) {
      // TODO: Check for remaining pool for 2 token draws
      game.removeTokens(this.tokens);
      this.player.addTokens(this.tokens);
      console.log(`${this.player.name} drew ${this.tokens} tokens`);
    }
    if (!this.discardedTokens.isEmpty()) {
      this.player.removeTokens(this.discardedTokens);
      game.addTokens(this.discardedTokens);
      console.log(
        `${this.player.name} discarded ${this.discardedTokens} tokens`
      );
    }
  }
}

class BuyAction extends Action {
  constructor(id, ...args) {
    super(...args);
    this.id = id;
    // card = card;
  }

  apply(game) {
    const card = game.getCardById(id);
    if (game.market.includes(card)) {
      if (this.player.canAfford(card)) {
        this.player.boughtCards.push(card);
        game.market.splice(game.market.indexOf(card));
      }
    } else if (this.player.reservedCards.includes(card)) {
      if (this.player.canAfford(card)) {
        this.player.boughtCards.push(card);
        this.player.reservedCards.splice(
          this.player.reservedCards.indexOf(card)
        );
      }
    }

    console.log(`${this.player.name} bought a card`);
  }
}

class ReserveAction extends Action {
  // TODO: Extend for reserving from deck
  constructor(id, ...args) {
    super(...args);
    this.id = id;
  }

  apply(game) {
    const card = game.getCardById(this.id);
    if (game.market.includes(card)) {
      if (this.player.reservedCards.length < 3) {
        this.player.reservedCards.push(card);
        game.market.splice(game.market.indexOf(card));
      }
    }

    console.log(`${this.player.name} reserved a card`);
  }
}

class PassAction extends Action {
  apply() {
    console.log(`${this.player.name} passed their turn`);
  }
}

module.exports = { Action, BuyAction, PassAction, ReserveAction, TokenAction };
