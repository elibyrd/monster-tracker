# Monster Tracker

Tool for managing monster resources in combat-heavy TTRPG systems.

## Features

### Health tracking

Create a new card for each monster to track its HP. Each monster has a separate health pool, and they are automatically sorted by name.

Modify monster health using similar patterns as tokens on Foundry or Roll20: remove health by entering a negative number ("-5"), add health by using the plus symbol ("+5"), or set the monster's HP to a particular value by entering an integer without any symbol ("5").

A monster's card changes color according to its current health:
- Above maximum health: green
- At or below maximum health: yellow
- At or below 0 health: red

If you add the same monster (e.g. "Skeleton") multiple times, the tool will automatically number them ("Skeleton 1", "Skeleton 2"). Any new monsters are inserted at the lowest open position. If your tokens or miniatures are numbered, this lets you recycle previously defeated monsters without any renumbering.

#### Armor class (AC)
You can optionally add an armor class (AC) to a monster card by filling in the "AC" field. If you specify a (nonzero) AC when creating a monster, it will appear below the monster's health.

### Legendary actions and reactions

In addition to monster health, you can also track legendary actions and reactions. Any monsters with legendary options will appear in a prioritized column on the left. Use the "Tick" button to reduce a legendary counter by 1, and the "Reset" button to refill it to its maximum value.

### Statblocks

You can add additional information to a monster's card using the "Statblock" field. This field supports Markdown (including [GitHub Flavored Markdown](https://github.github.com/gfm/)). If you add statblock info when creating a monster, it will be accessible through a flyout sidebar by clicking the "Info" button on that monster's card.

### History

The app stores all changes to health and legendary resources in a history system, which allows you to view and undo changes you may have made in error. Use the "History" button to see a list of recent changes, and the "Undo" button to revert the most recent change.

## Local setup

1. Copy `config-sample.json` to a new file, `config.json`. You can keep the default settings or customize the configuration.
2. Run `npm install` to install the required dependencies.
3. Run `npm start` to boot up a local server. Webpack should launch the application in your default browser, and will also display the URL in the console.
4. When you're ready to deploy, run `npm run build` to build the application. Copy the contents of the `public` directory to your webroot.

## Preset monsters

The app can retrieve monster data from a configured endpoint and offer them as "presets" in the monster form. This allows you to prepare complex stat blocks for a variety of monsters and quickly add them to an encounter on the fly. The app expects JSON data in the following format:

```
{
  "data": [
    {
      "id": 1,
      "name": "Gelatinous Cube",
      "maxHP": 84,
      "AC": 6,
      "legendaryActions": null,
      "legendaryResistances": null,
      "statblock": "Large ooze, unaligned"
    }
  ]
}
```

Some notes about the data:
  - Each `id` attribute must be unique. It can be a string or integer.
  - The `name` attribute must be a string.
  - The `maxHP` attribute must be an integer.
  - The `AC`, `legendaryActions`, and `legendaryResistances` attributes must be integer values or null.
  - The `statblock` attribute may be a string or null.

If you wish to use this feature, configure the endpoint that serves the monster data in config.json under the `PRESETS_ENDPOINT` variable. The default value of `false` will disable this feature.

A Laravel application for collecting and serving this data is available at [monster-tracker-backend](https://github.com/elibyrd/monster-tracker-backend).
