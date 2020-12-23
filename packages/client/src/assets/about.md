# V2018 Scenario Generator

One of the challenges in the domain of safety and security is to stand guard against unknown threats. As we have seen in the recent past, terrorists and other criminals continuously come up with new ways to attack our society. Therefore, in order to better prepare ourselves, we have to come up with creative threat scenarios, and think outside-the-box, so to speak. This is easier said than done, as recent experiences often limit our creativity. This scenario generator is developed to remedy this situation. It generates many threat scenarios for you, and when you have found one to your liking, you can add a narrative and save it for future reference.

## The concept

The idea behind the scenario generator is simple. A threat scenario consists of two aspects:

- Threat: defining the dimensions of the threat itself, such as the perpetrators, the impact that they have, their motivations and modus operandi.
- Context: defining the dimensions of the  circumstances that surround the threat or attack, such as the location, the weather conditions, or the budget that is available to them.

In this tool, you can specify the dimensions for threat and context, as well as the values that each dimension takes. For example, the context dimension weather can have a value of rainy or sunny and the treat dimension actor can have a value of terrorist or criminal. Together, it is possible to create 4 scenarios, as shown in below table:

| Threat \\ Context| rainy      | sunny      |
|------------------|------------|------------|
| terrorist        | scenario 1 | scenario 2 |
| criminal         | scenario 3 | scenario 4 |

In other words, scenario 1 is about a terrorist on a rainy day, scenario 2 about a terrorist on a sunny day, etc. 

In case you have only two dimensions, the scenario generation is rather limited, but we normally use 10~15 dimensions for threat as well as context, in which case the number of scenarios one can generate is very large. Typical usage is to either generate a number of scenarios that span the dimension uniformly, and next to select the ones that make sense to you, or alternatively, to generate a single scenario at a time, and save the ones that appeal to you. Here, the latter approach is followed.

In order to limit the possible combinations of all dimensions, this tool allows you to:

- Lock certain dimensions: for example, in case you are only interested in scenarios that involve a specific hotel in a specific city, you can select the value and lock it, so it will never change, and all scenarios that are generated will be in this hotel in that city.
- Disallow or discourage certain combinations: for example, a drone attack during a rainy day is not very likely, so you can define it as unlikely or impossible in the 'consistencies' table. When set, scenarios that combine a drone attack with a rainy day will not occur anymore.

After generating scenarios one at a time, and saving the ones that appeal to you, the last and optional final step is to add a narrative to the generated scenario. Additionally, in case it is relevant for the current scenario, locations and objects of interest can also be shown on the map. For example, if the scenario takes place in a hotel in The Hague, NL, the map displays the city of The Hague, including the hotels (thanks to OpenStreetMap).

## How to use it

The scenario generator is setup as a wizard:

1. Define the dimensions of the threat and context that you consider important.
2. Set all inconsistencies between dimensions: most combinations are typically allowed, so specify the few that you do not want to see, or only seldom.
3. Use the generator to generate a scenario, i.e. a combination of threat and context dimensions. You can optionally lock certain dimensions, e.g. the location or the actor, while varying the rest on each turn. When an interesting combination is found, save it under a new name, and optionally add a narrative.
4. Inspect and present all generated scenarios, which are also shown on the map. On this page, you can also print a scenario using the regular CTRL-P option.

## Further information

This tool was developed by TNO for the Dutch gendarmerie (KMAR) and National Police. For more information, please contact [Erik Vullings, PhD MSc](mailto:erik.vullings@tno.nl)

Issues with the tool can be reported at <a href="https://github.com/tnocs/scenario-generator" target="_blank">Github</a>