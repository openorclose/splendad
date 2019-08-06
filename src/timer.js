class Timer {
  constructor(players) {
    this.players = players;
    this.timerRemaining = new Map();
    players.forEach(player => this.timerRemaining.set(player, 120));
  }

  getRemainingTime(player) {
    return 0;
  }
}

module.exports = Timer;
