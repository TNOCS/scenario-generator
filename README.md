# V2018 Scenario Generator

Generate a scenario based on a morphological box.

![screenshot](https://github.com/TNOCS/scenario-generator/blob/master/img/screenshot.png?raw=true)

Live demo at [https://tnocs.github.io/scenario-generator](https://tnocs.github.io/scenario-generator).

## Prerequisites

[Yarn classic](https://classic.yarnpkg.com/lang/en/) or PNPM (`npm i -g pnpm`).

## Install dependencies

Run `yarn` from the root folder of this project. The application uses [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to handle dependencies between packages.

Alternatively, run `pnpm m i` from the command line to install all dependencies.

## Develop

Run `yarn dev` or `npm run dev` to start developing.

## Build

Run `yarn build` or `npm run build` to build a release.

## Creating a new configuration

The current version does not come with a full-blown configuration editor. Although you can edit object types, in case you want to limit or increase the number of categories, you need to edit the JSON file manually.

### Step 1: Download the JSON file

Open the menu (top left, 3 horizontal lines) and select IMPORT/EXPORT. Export the current file.

### Step 2: Renaming a category

Replace the capitalized names in the JSON below. The CATEGORY_NAME is displayed at the name of the tab. You can have multiple categories. Each category specifies the dimensions (columns or rows) that must be shown. You can choose from the following dimensions (which also includes the singular and plural form that is displayed in the GUI):

- Access: access | access
- Action: action | actions
- Actor: actor | actors
- AvailableBudget: budget | budget
- BehaviourDuringPreparation: behaviour during preparation
- Capabilities: capability | capabilities
- CompartmentsPresent: compartments present
- CriminalPhase: criminal phase
- Duration: duration | durations
- Equipment: equipment | equipment
- ExistingInfra: existing infra | existing infrastructures
- Impact: impact
- Intent: bystander intent
- Location: location | locations
- Means: means | means
- MeansWeapon: means/weapon | means/weapons
- ModusOperandiDuringExecution: mode of operation | modus operandi
- Motivation: motivation | motivations
- OpenCompartments: open compartment | open compartments
- PeopleDensity: person density | person densities
- Persons: person | persons
- PhysicalAngleOfAttackDuringExecution: physical angle of attack | physical angle of attacks
- PI: protected interest (target) | protected interests
- PrivacyAwareness: privacy awareness
- RelationOwnerObjectAndOwnerSecuritySystem: relation owner object and owner security system
- Responsibility: responsibility | responsibilities
- SecurityAwareness: security awareness
- TargetType: target type | target types
- ThreatDirection: threat direction | threat directions
- TypeOfEnvironment: environment type | environment types
- TypeOfObject: type of object | type of objects
- WeatherBehaviour: weather behaviour
- WeatherType: weather condition | weather conditions
- MeansWeapon: means/weapon | means/weapons
- MissionContext: mission context | mission contexts
- Adversary: adversary | adversaries
- C2HeadQuarters: C2-HQ location | C2-HQ locations
- Target: target | targets
- DeliberateAction: deliberate action | deliberate actions
- Means2: means of attack | means of attack
- Access2: means of access | means of access
- Means2access: means to access | means to acces

```json
{
  "scenarios": {
    "current": {
      "inconsistencies": [],
      "narratives": [],
      "id": "ANY_ID",
      "type": "scenarios",
      "category": "SCENARIO",
      "name": "SCENARIO_NAME",
      "categories": {
        "CATEGORY_NAME": [
          "Actor",
          "Action",
          "Means",
          "Access",
          "TypeOfObject"
        ]
      }
    },
    "list": [
      {
        "inconsistencies": [],
        "narratives": [],
        "id": "ANY_ID",
        "type": "scenarios",
        "category": "SCENARIO",
        "name": "SCENARIO_NAME",
        "categories": {
          "CATEGORY_NAME": [
            "Actor",
            "Action",
            "Means",
            "Access",
            "TypeOfObject"
          ]
        }
      }
    ]
  },
  // ...
}
```

### Step 3: Add the dimensions

For each dimension that you are using, you need to create an initial (optionally empty) placeholder. For example, if you include the dimension Actor, the JSON configuration needs to contain an Actor property:

```json
  "Actor": { "list": [] },
```

Although you can pre-populate the list, as in the example below, it is much easier to edit these items via the GUI.

```json
  "Actor": {
    "list": [
      { "name": "Activist", "type": "Actor", "id": "af0c21eb" }
    ]
  },
```

### Step 4: Putting it all together

When you are done, save the JSON configuration and load it via the same menu (IMPORT|EXPORT) and you are ready to start. A very simple JSON file to get you going is:

```JSON
{
  "scenarios": {
    "current": {
      "inconsistencies": [],
      "narratives": [],
      "id": "ts1",
      "type": "scenarios",
      "category": "SCENARIO",
      "name": "Threat scenario 1",
      "categories": {
        "Threat scenario": [
          "Actor",
          "PI",
          "Action",
          "MeansWeapon",
          "Access"
        ]
      }
    },
    "list": [
      {
        "inconsistencies": [],
        "narratives": [],
        "id": "ts1",
        "type": "scenarios",
        "category": "SCENARIO",
        "name": "Threat scenario 1",
        "categories": {
          "Threat scenario": [
            "Actor",
            "PI",
            "Action",
            "MeansWeapon",
            "Access"
          ]
        }
      }
    ]
  },
  "Actor": {
    "list": []
  },
  "PI": {
    "list": []
  },
  "Action": {
    "list": []
  },
  "MeansWeapon": {
    "list": []
  },
  "Access": {
    "list": []
  }
}
```
