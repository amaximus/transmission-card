[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

<p><a href="https://www.buymeacoffee.com/6rF5cQl" rel="nofollow" target="_blank"><img src="https://camo.githubusercontent.com/c070316e7fb193354999ef4c93df4bd8e21522fa/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76312e7376673f6c6162656c3d4275792532306d6525323061253230636f66666565266d6573736167653d25463025394625413525413826636f6c6f723d626c61636b266c6f676f3d6275792532306d6525323061253230636f66666565266c6f676f436f6c6f723d7768697465266c6162656c436f6c6f723d366634653337" alt="Buy me a coffee" data-canonical-src="https://img.shields.io/static/v1.svg?label=Buy%20me%20a%20coffee&amp;message=%F0%9F%A5%A8&amp;color=black&amp;logo=buy%20me%20a%20coffee&amp;logoColor=white&amp;labelColor=b0c4de" style="max-width:100%;"></a>
</p>

# Custom Transmission card for HomeAssistant/Lovelace

This Lovelace custom card displays torrents information provided by the Transmission Integration.
It also supports turtle mode and start/stop of all torrents.
You can cycle through the different torrent types by clicking on the type label.

### Installation

The easiest way to install it is through [HACS (Home Assistant Community Store)](https://github.com/hacs/frontend),
search for *Transmission* in the Frontend section and select Transmission Card.<br />
If you are not using HACS, you may download transmission-card.js and put it into
homeassistant_config_dir/www/community/transmission-card/ directory.<br />

### Lovelace UI configuration

Please add the card to the resources in configuration.yaml:

```
resources:
  - {type: js, url: '/hacsfiles/transmission-card/transmission-card.js'}
```

### Options

#### Card options

| Name                     | Type         | Required     | Default                 | Description                          |
| -------------------------| ------------ | ------------ | ----------------------- | ------------------------------------ |
| type                     | string       | **required** |                         | `custom:transmission-card`           |
| no_torrent_label         | string       | optional     | `No Torrents`           | label displayed with no torrents, to hide set "" |
| hide_turtle              | boolean      | optional     | false                   | hide turtle button                   |
| hide_startstop           | boolean      | optional     | false                   | hide start/stop button               |
| hide_type                | boolean      | optional     | true                    | hide type selector                   |
| default_type             | string       | optional     | `total`                 | type of torrents to display at start |
| display_mode             | string       | optional     | `compact`               | display mode: compact or full        |
| sensor_name              | string       | optional     | `transmission`          | DEPRECATED. Name of the sensor. Use sensor_entity_id instead. It will be removed in a later release. |
| sensor_entity_id         | string       | optional     | `transmission`          | name of the sensor. Useful when using different entity name either deliberately or by e.g. HA generating localized entity name/id |
| hide_header              | boolean      | optional     | false                   | hide header text at the top of card  |
| header_text              | string       | optional     | `Transmission`          | header text at the top of card       |
| force_status_newline     | boolean      | optional     | false                   | display the status on a separate line to avoid flickering due to different text lengths |
| hide_status              | boolean      | optional     | false                   | hide status label |
| hide_download_speed      | boolean      | optional     | false                   | hide download speed |
| hide_upload_speed        | boolean      | optional     | false                   | hide upload speed |
| hide_add_torrent         | boolean      | optional     | false                   | hide add torrent input               |
| hide_delete_torrent      | boolean      | optional     | false                   | hide delete torrent button           |
| hide_delete_torrent_full | boolean      | optional     | false                   | hide delete torrent with data button |
| hide_torrent_list        | boolean      | optional     | false                   | hide torrent list |
| default_sort             | string       | optional     | `name`                  | sort type to display torrents at start |
| hide_sort                | boolean      | optional     | true                    | hide sort selector |
| default_order            | string       | optional     | `ascending`             | sort order to display torrents at start |
| hide_order               | boolean      | optional     | true                    | hide sort selector |
| default_limit            | string       | optional     | `all`                   | limit number of torrents to display at start |
| hide_limit               | boolean      | optional     | true                    | hide limit selector |

Accepted values for default_type are: `total`, `active`,`completed`,`paused`,`started`.

Accepted values for default_sort are: `name`, `added_date`,`id`,`status`.

Accepted values for default_limit are: `all`, `5`,`10`,`15`.

Accepted values for default_order are: `ascending`, `descending`.

Please find below an example of ui-lovelace.yaml card entry:

```yaml
    cards:
      - type: custom:transmission-card
        hide_type: false
        default_type: 'active'
```

Transmission idle in compact mode:

![Transmission idle](https://raw.githubusercontent.com/amaximus/transmission-card/main/transmission_idle.jpg)

Transmission downloading in full mode:

![Transmission downloading](https://raw.githubusercontent.com/amaximus/transmission-card/main/transmission_downloading_full_mode.jpg)

## Thanks

Thanks to all the people who have contributed!

[![contributors](https://contributors-img.web.app/image?repo=amaximus/transmission-card)](https://github.com/amaximus/transmission-card/graphs/contributors)
