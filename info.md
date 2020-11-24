[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)
<p><a href="https://www.buymeacoffee.com/6rF5cQl" rel="nofollow" target="_blank"><img src="https://camo.githubusercontent.com/c070316e7fb193354999ef4c93df4bd8e21522fa/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76312e7376673f6c6162656c3d4275792532306d6525323061253230636f66666565266d6573736167653d25463025394625413525413826636f6c6f723d626c61636b266c6f676f3d6275792532306d6525323061253230636f66666565266c6f676f436f6c6f723d7768697465266c6162656c436f6c6f723d366634653337" alt="Buy me a coffee" data-canonical-src="https://img.shields.io/static/v1.svg?label=Buy%20me%20a%20coffee&amp;message=%F0%9F%A5%A8&amp;color=black&amp;logo=buy%20me%20a%20coffee&amp;logoColor=white&amp;labelColor=b0c4de" style="max-width:100%;"></a>
</p>

# Custom Transmission card for HomeAssistant/Lovelace

This Lovelace custom card displays torrents information provided by the Transmission Integration.

#### Installation
The easiest way to install it is through [HACS (Home Assistant Community Store)](https://custom-components.github.io/hacs/),
search for <i>Transmission</i> in the Frontend section and select Transmission Card.<br />
If you are not using HACS, you may download transmission-card.js and put it into
homeassistant_config_dir/www/community/transmission-card/ directory.<br />

#### Lovelace UI configuration
Please add the card to the resources in configuration.yaml:

```
resources:
  - {type: js, url: '/hacsfiles/transmission-card/transmission-card.js'}
```

Please find below an example of ui-lovelace.yaml:

```
    cards:
      - type: custom:transmission-card
```

Transmission idle, two torrents stopped:<br />
![Transmission idle](https://raw.githubusercontent.com/amaximus/transmission-card/main/transmission_idle.png)

Transmission downloading:<br />
![Transmission downloading](https://raw.githubusercontent.com/amaximus/transmission-card/main/transmission_downloading.png)

