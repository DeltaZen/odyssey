# The Isle-Hop Odyssey

### A game made for JS13kGames 2024 with theme: Triskaidekaphobia

#### Ahoy Corsair! Welcome to The Isle-Hop Odyssey, where you start on an island with little more than your two legs and a soon-to-be-rusty ship nearby. Hop from island to island like a seafaring kangaroo - or maybe more like a seagull after a cake - conquering forts, looting dungeons, and battling crabs, as you sail through treacherous seas filled with giant squids and sea serpents just waiting to ruin your day.

#### Your mission? Siege castles, build up your crew, and loot dungeons, all while trying not to sink your ship or get pinched by a particularly grumpy crab. But don't get too cozy! There is a mysterious island no one talks about - except when they’re screaming in terror. The 13th island, The Cursed Isle, hides the nastiest dungeon of them all, home to a certain Balron who's been feeling a bit cranky lately and definitely doesn’t like visitors. So, buckle up, sailor! Your Odyssey awaits - if you don’t get eaten by a squid first!

![Game Thumb](https://www.foumartgames.com/games/Odyssey/screen_4.png)

### Controls:

In-game mobile controls are available in the bottom left and bottom right part of the screen.

Desktop controls: Arrow keys to move the player, menu navigation not yet implemented.

### Gameplay:

You have three main characters: the Hero, the Crew, and the Ship. All three units have certain health points and attack damage. The Crew and the Ship's stats can be improved via upgrades in the Castles/Forts, while the Captain has to gain experience by winning battles in order to level up and increase Health/Attack. Combat depends on your location: when sailing, you'll fight with the Ship; when on land, you'll battle with the Hero and Crew.

Your adventure kicks off on an island with a castle where you can upgrade your Ship. Scattered across the map are other islands, some with enemy-occupied forts and others with dungeons.

Your first task? Conquer these forts and the easier dungeons to build up your strength. But don't get too comfortable! Your ultimate mission is to defeat the Balron, a fearsome foe lurking in the deepest level of the dungeon on the 13th Cursed Island. And remember, you have just 13 days to accomplish this! Good luck!

The game has an installable [Progressive Web App version](https://www.foumartgames.com/games/Odyssey/). Enjoy!

## Installation
Run **`npm install`** to install build dependencies.

## Tasks
**`npm build`** builds the game, reports archive size and serves locally with browser sync live reload enabled.

**`npm debug`** builds the game without any minifying for easier debugging. Includes detailed console logs.

## Build task parameters
*`--pwa`* instructs to build a Progressive Web App - will add 864 bytes when zipped.

*`--mobile`* adds some html tags regarding mobile and iOS icons - increases the zip filesize with 45 bytes.

*`--social`* adds some html tags for SEO and social media (twitter) - will add around 100 bytes, depending on description length.

*`--roadroll`* instructs to compress the the game with Roadroller

