# frozen_string_literal: true

GAMES[:pokemon] = {
  title:           'Pokemon',
  generator_title: 'Party',
  background:      'pokemon.jpg',
  added:           Date.strptime('20150305', '%Y%m%d'),
  last_updated:    Date.strptime('20150305', '%Y%m%d'),
  columns:         {
    game:        {
      help:               'This is optional, play whatever you want to play',
      chance_of_multiple: 0,
      min:                1,
      max:                1,
      options:            [
        :'Red or Blue',
        :Yellow,
        :'Gold or Silver',
        :Crystal,
        :'Ruby or Sapphire',
        :'FireRed or LeafGreen',
        :Emerald,
        :'Ruby & Sapphire',
        :'Diamond or Pearl',
        :Platinum,
        :'HeartGold or SoulSilver',
        :'Black or White',
        :'Black 2 or White 2',
        :'X or Y',
        :'Omega Ruby or Alpha Sapphire',
      ],
    },
    starter:     {
      chance_of_multiple: 0,
      min:                1,
      max:                1,
      options:            %i[
        Grass
        Water
        Fire
      ],
    },
    party_types: {
      help:                    "This is the primary type of each pokemon, you can use dual-types. If you don't have one yet, either leave the slot open or use your starter. If your game does not have this type, reroll. You can swap a pokemon out to use HMs or hatch eggs",
      min:                     6,
      max:                     6,
      allow_duplicate_options: true,
      options:                 %i[
        Normal
        Fighting
        Flying
        Poison
        Ground
        Rock
        Bug
        Ghost
        Steel
        Fire
        Water
        Grass
        Electric
        Psychic
        Ice
        Dragon
        Dark
        Fairy
      ],
    },
    modifiers:   {
      chance_of_multiple: 35,
      min:                1,
      max:                5,
      options:            [
        :"Nuzlocke Run",
        :"Only use HMs outside of battle",
        :'Only capture a single pokemon of each assigned type',
        :'Do not evolve your pokemon',
        :'If a pokemon faints, release them',
        :'No items',
        [
          :'Only use the most appropriate pokeball available to capture a pokemon',
          :'Only use pokeballs',
          :'Only use premier balls',
        ],
        :'Use no potions other than regular potions',
        :'No antidote',
        :'No paralyze heal',
        :'No burn heal',
        :'No ice heal',
        :'No escape ropes',
        :'Always walk through the grass',
        :'No exp share',
        :'No stat enhancing items',
        [
          :'Wedlocke challenge',
          :'Only male pokemon',
          :'Only female pokemon',
        ],
        :'Try to complete every npc trade in the game',
        :'No TMs',
        :'No breeding',
        [
          :'If a trainer appears on your screen you have to fight them',
          :'Attempt to avoid all trainer battles',
        ],
        :'Avoid grass where possible',
        :'Keep a full stock of pokeballs and try to capture one of every pokemon you encounter',
        :'Attempt to complete your region\'s pokedex',
        :'You cannot beat the elite four before completing your region\'s pokedex',
        :'No trading with players',
        :'If you can, go into the game without any knowledge of the game',
        :'You must make your pokemon learn every move it attempts to learn',
        :'No Great Balls',
        :'No Ultra Balls',
        [
          :'Use no dual-types except your starter',
          :'Dual-types only, except your starter or pokemon that evolve into dual-types',
        ],
        [
          :'You can only use pokecenters when you white out',
          :'When a pokemon faints you have 2 minutes to get to a pokecenter, if you don\'t get there in time you must release the pokemon',
        ],
        :'Nickname all pokemon',
        :'You cannot use the PC except to release pokemon or fulfill other modifiers',
        :'You have one hour to capture as many pokemon as possible, once that hour is up you cannot catch any more. You may ignore your assigned types.',
        :'The first pokemon in each slot is the only evolution tree you may use in that slot',
        :'No healing during trainer battles',
        :'No items during trainer battles',
        :'The Ash Ketchum run - Every time you beat a gym you must release all but your starter pokemon, reroll your modifers and start your party over',
        [
          :'No Legendaries',
          :'When you capture a legendary it replaces the first non-legendary slot in your party and cannot be replaced, for your remaining slots you can choose any of your six assigned types',
        ],
        [
          :'Do not ever swap pokemon out',
          :'Always swap out your pokemon when asked',
        ],
        :'Try to keep all your pokemon the same colour',
        :'Solo run - Only take one of your assigned pokemon, when it faints replace it with another of your assigned pokemon. Only use the first when you have used all six',
        :'Solo run - Only take one of your assigned pokemon, when it faints wonder trade it, whatever you get back is your new solo pokemon',
        :'Solo run - Only take one of your assigned pokemon',
        :'No held items',
        [
          :'Replace the first slot pokemon with your starter',
          :'Trade your starter away on Wonder Trade (if available) replace your slot one pokemon with whatever you get',
          :'Do six wonder trades, the pokemon you receive replace your six assigned pokemon',
          :'All slots are replaced with your starter\'s type',
          :'All slots are replaced with your first slot\'s type',
          :'All slots are replaced with your second slot\'s type',
          :'All slots are replaced with your third slot\'s type',
          :'All slots are replaced with your fourth slot\'s type',
          :'All slots are replaced with your fifth slot\'s type',
          :'All slots are replaced with your sixth slot\'s type',
        ],
        :'No flying',
        :'Never run from battles',
        :'Assert your dominance by attempting to catch the first pokemon of each trainer you fight',
        :"You are now playing Digimon, give all your pokemon a nickname ending with 'mon'",
        :'Donate half of your money to pokemon in need by spending half of your cash each time you visit a pokemart on potions and dropping them off in your pc',
        :'As soon as is possible, replace one slot of your choice with an egg at all times',
        [
          :'Four legged pokemon only',
          :'Anthropomorphic pokemon only',
        ],
        :'No bike except when absolutely required',
        :'No standard items - Herbal remedies and berries only',
        :'No berries',
        :'Eevee party - Where possible, use an Eevee or Eevelution to fill a slot',
        :'Every time you visit a pokemart you must spend all of your money',
        :'Only use pokemon introduced in the generation you are playing',
        :'Capture at least one pokemon in each route before moving on once you have obtained pokeballs',
      ],
    },
  },
}
