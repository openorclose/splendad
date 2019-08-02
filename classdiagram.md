# Class diagram

```sequence
Host -> Client: Game state (ur turn)
Client -> Host: Action (ok i buy this)
Host -> Host: Simulate clients' actions
Client -> Client: Simulate self action
Host -> Client: Updated game state
Client -> Client: "Reconcile game state \n with host's game state"
```
### class Action
+ gameId: Number
+ player: Player
+ timestamp: Number

### class TokenAction 
+ tokens: Map<Token, Number>
+ discardedTokens: Map<Token, Number>

### class BuyAction
+ card: Card

### class ReserveAction
+ card: Card

### class PassAction




### class Game
+ id: Number
+ players: Player[]
+ timer: Timer
+ deck: Map<Number, Card[]>
+ market: Map<Number, Card[]>
+ tokens: Map<Token, Number>
+ combos: Combo[]
+ state: State
+ host: Player
+ winners: Player[] 

### class Player
+ id: Number
+ name: String
+ boughtCards: Card[]
+ reservedCards: Card[]
+ boughtCombos: Combo[]
+ tokens: Map<Token, Number>
+ points: Number
+ isHost: Boolean

### class Timer
+ getRemainingTime(Player): Number

### class Card
+ tier: Number
+ color: Color
+ cost: Map<Token, Number>
+ points: Number


### class Combo
+ requirements: Map<Color, Number>
+ points: Number

### class Token
+ color: Color

### enum State
+ PreInit
+ Start
+ Round
+ FinalRound
+ End

### enum Color
+ Red
+ Green
+ Blue
+ White
+ Black
+ Wildcard
```javascript=
const Color = {
    RED:Symbol('Red'),
    BLUE:Symbol('Blue')
    //...
}
