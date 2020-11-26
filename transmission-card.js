class TransmissionCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _getTorrents(hass) {
    var res = [];
    if (typeof hass.states['sensor.transmission_total_torrents'] != "undefined") {
      const data1 = hass.states['sensor.transmission_total_torrents'].attributes['torrent_info'];
      Object.keys(data1 || {}).forEach(function (key) {
        res.push({
          name: key,
          id: data1[key].id,
          percent: parseInt(data1[key].percent_done, 10),
          state: data1[key].status,
          added_date: data1[key].added_date,
        });
      });
    }
    return res;
  }

  _getGAttributes(hass) {
    if (typeof hass.states['sensor.transmission_down_speed'] != "undefined") {
      return {
        down_speed: hass.states['sensor.transmission_down_speed'].state,
        down_unit: hass.states['sensor.transmission_down_speed'].attributes['unit_of_measurement'],
        up_speed: hass.states['sensor.transmission_up_speed'].state,
        up_unit: hass.states['sensor.transmission_up_speed'].attributes['unit_of_measurement'],
        status: hass.states['sensor.transmission_status'].state
      }
    }
    return {
      down_speed: undefined,
      up_speed: undefined,
      down_unit: "MB/s",
      up_unit: "MB/s",
      status: "no sensor"
    };
  }

  _toggleTurtle() {
    this.myhass.callService('switch', 'toggle', { entity_id: 'switch.transmission_turtle_mode' });
  }

  _startStop() {
    this.myhass.callService('switch', 'toggle', { entity_id: 'switch.transmission_switch' });
  }

  setConfig(config) {
    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const defaultConfig = {
      'no_torrent_label' : 'No torrents'
    }

    this._config = {
      ...defaultConfig,
      ...config
    };

    const card = document.createElement('ha-card');
    card.setAttribute('header', 'Transmission');
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
#attributes {
  margin-top: 1.4em;
  padding-bottom: 0.8em;
}
.progressbar {
  border-radius: 0.4em;
  margin-bottom: 0.6em;
  height: 1.4em;
  display: flex;
  background-color: #f1f1f1;
  z-index: 0;
  position: relative;
  margin-left: 1.4em;
  margin-right: 1.4em;
}
.progressin {
  border-radius: 0.4em;
  height: 100%;
  z-index: 1;
  position: absolute;
}
.name {
  margin-left: 0.7em;
  width: calc(100% - 60px);
  overflow: hidden;
  z-index: 2;
  color: var(--text-light-primary-color, var(--primary-text-color));
}
.percent {
  vertical-align: middle;
  z-index: 2;
  margin-left: 1.7em;
  margin-right: 0.7em;
  color: var(--text-light-primary-color, var(--primary-text-color));
}
.downloading {
  background-color: var(--paper-item-icon-active-color);
}
.c-Downloading {
  color: var(--paper-item-icon-active-color);
}
.seeding {
  background-color: var(--light-primary-color);
}
.c-seeding {
  color: var(--light-primary-color);
}
.stopped {
  background-color: #9e9e9e!important;
}
.c-idle {
  color: #9e9e9e!important;
}
.up-color {
  width: 2em;
  color: var(--light-primary-color);
}
.down-color {
  width: 2em;
  color: var(--paper-item-icon-active-color);
  margin-left: 1em;
}
table {
  margin-top: -20px;
  border: none;
  padding-left: 1.3em;
  margin-left: 0em;
  margin-right: 1em;
  margin-bottom: -1.3em;
}
.status {
  font-size: 1em;
  margin-left: 0.5em;
}
.turtle_off {
  color: var(--light-primary-color);
}
.turtle_on {
  color: var(--paper-item-icon-active-color);
}
.start_on {
  color: var(--light-primary-color);
}
.start_off {
  color: var(--primary-color);
}
.no-torrent {
  margin-left: 1.4em;
}
    `;
    content.innerHTML = `
      <table id='title'></table>
      <div id='attributes'></div>
    `;
    card.appendChild(style);
    card.appendChild(content);
    root.appendChild(card)
  }

  _updateContent(element, torrents) {
    if (torrents.length > 0) {
      element.innerHTML = `
      ${torrents.map((torrent) => `
        <div class="progressbar">
          <div class="${torrent.state} progressin" style="width:${torrent.percent}%">
          </div>
          <div class="name">${torrent.name}</div>
          <div class="percent">${torrent.percent}%</div>
        </div>
      `).join('')}
    `;
    } 
    else {
      element.innerHTML = `<div class="no-torrent">${this._config.no_torrent_label}</div>`;
    }
  }

  _updateTitle(element, gattributes) {
    element.innerHTML = `
        <tr>
           <td><span class="status c-${gattributes.status}">${gattributes.status}</span></td>
           <td><ha-icon icon="mdi:download" class="down-color"></td>
           <td>${gattributes.down_speed} ${gattributes.down_unit}</td>
           <td><ha-icon icon="mdi:upload" class="up-color"></td>
           <td>${gattributes.up_speed} ${gattributes.up_unit}</td>
           <td><ha-icon-button icon="mdi:turtle" title="turtle mode" id="turtle"></ha-icon-button></td>
           <td><ha-icon-button icon="mdi:stop" title="start/stop all" id="start"></ha-icon-button></td>
        </tr>
    `;

    const root = this.shadowRoot;
    var turtleElement = root.getElementById('turtle');
    turtleElement.addEventListener('click', this._toggleTurtle.bind(this));
    turtleElement.className = "turtle_" + this.myhass.states['switch.transmission_turtle_mode'].state;

    var playStartElement = root.getElementById('start')
    playStartElement.addEventListener('click', this._startStop.bind(this));
    if (this.myhass.states['switch.transmission_switch'].state === "on") {
      playStartElement.icon = "mdi:stop";
    } else {
      playStartElement.icon = "mdi:play";
    }
    playStartElement.className = "start_" + this.myhass.states['switch.transmission_switch'].state;
  }

  set hass(hass) {
    const root = this.shadowRoot;
    this.myhass = hass;

    let torrents = this._getTorrents(hass);
    let gattributes = this._getGAttributes(hass);

    this._updateTitle(root.getElementById('title'), gattributes);
    this._updateContent(root.getElementById('attributes'), torrents);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('transmission-card', TransmissionCard);
