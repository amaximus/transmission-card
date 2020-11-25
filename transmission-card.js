class TransmissionCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _getAttributes(hass) {
    var id = new Array();
    var percent = new Array();
    var name = new Array();
    var state = new Array();
    var added_date = new Array();
    var routeobjarray = [];

    if ( typeof hass.states['sensor.transmission_total_torrents'] != "undefined" ) {
      var ttorrents = hass.states['sensor.transmission_total_torrents'].state;
      if ( ttorrents > 0 ) {
        var data1 = JSON.parse(JSON.stringify(hass.states['sensor.transmission_total_torrents'].attributes['torrent_info']));
        var tidx=0;
        var torrent_data;
        Object.keys(data1).forEach(function(key) {
          name[tidx] = key;
          torrent_data = JSON.parse(JSON.stringify(data1[key]));
          Object.keys(torrent_data).forEach(function(tkey) {
            switch (tkey) {
              case 'id':
                id[tidx]=torrent_data[tkey];
                break;
              case 'percent_done':
                percent[tidx] = parseInt(torrent_data[tkey]);
                break;
              case 'status':
                state[tidx] = torrent_data[tkey];
                break;
              case 'added_date':
                added_date[tidx] = torrent_data[tkey];
                break;
            }
          });
          tidx += 1;
        });

        for (var i=0; i < ttorrents; i++) {
          routeobjarray.push({
            name: name[i],
            id: id[i],
            percent: percent[i],
            state: state[i],
            added_date: added_date[i],
          });
        }
      }
    }
    return Array.from(routeobjarray.values());
  }

  _getGAttributes(hass) {
    var routeobjarray = [];
    var downspeed, upspeed;
    var downunit, upunit;
    var tstate = "no sensor";

    downspeed = upspeed = 0;
    downunit = upunit = "MB/s";

    if ( typeof hass.states['sensor.transmission_down_speed'] != "undefined" ) {
      downspeed = hass.states['sensor.transmission_down_speed'].state;
      downunit = hass.states['sensor.transmission_down_speed'].attributes['unit_of_measurement'];
      upspeed = hass.states['sensor.transmission_up_speed'].state;
      upunit = hass.states['sensor.transmission_up_speed'].attributes['unit_of_measurement'];
      tstate = hass.states['sensor.transmission_status'].state;
    }
    routeobjarray.push({
      down_speed: downspeed,
      up_speed: upspeed,
      down_unit: downunit,
      up_unit: upunit,
      tstate: tstate,
    });
    return Array.from(routeobjarray.values());
  }

  _toggleTurtle() {
    const root = this.shadowRoot;
    this.myhass.callService('switch', 'toggle', { entity_id: 'switch.transmission_turtle_mode' });
  }

  _startStop() {
    const root = this.shadowRoot;
    this.myhass.callService('switch', 'toggle', { entity_id: 'switch.transmission_switch' });
  }

  setConfig(config) {
    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
#attributes {
  margin-top: 1.4em;
  padding-bottom: 0.8em;
  display: block;
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
  height: 1.4em;
  z-index: 1;
  position: absolute;
}
.name {
  margin-left: 0.7em;
  float: left;
  width: 85%;
  overflow: hidden;
  z-index: 2;
  color: var(--text-light-primary-color, var(--primary-text-color));
}
.percent {
  vertical-align: middle;
  float: right;
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
  border: none;
  padding-top: 1.4em;
  padding-left: 1.3em;
  margin-left: 0em;
  margin-right: 1em;
  margin-bottom: -1.3em;
}
.title {
  font-size: 2em;
  padding: 0.2em 0em 0.2em 0em;
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
    `;
    content.innerHTML = `
      <table id='title'></table>
      <span id='attributes'></span>
    `;
    card.appendChild(style);
    card.appendChild(content);
    root.appendChild(card)
    this._config = cardConfig;
  }

  _updateContent(element, attributes) {
    element.innerHTML = `
      ${attributes.map((attribute) => `
        <div class="progressbar">
          <div class="${attribute.state} progressin" style="width:${attribute.percent}%">
          </div>
          <div class="name">${attribute.name}</div>
          <div class="percent">${attribute.percent}%</div>
        </div>
      `).join('')}
    `;
  }

  _updateTitle(element, gattributes) {
    element.innerHTML = `
      ${gattributes.map((attribute) => `
        <tr><td colspan=7 class="title">Transmission</td></tr>
        <tr>
           <td><span class="status c-${attribute.tstate}">${attribute.tstate}</span></td>
           <td><ha-icon icon="mdi:download" class="down-color"></td>
           <td>${attribute.down_speed}${attribute.down_unit}</td>
           <td><ha-icon icon="mdi:upload" class="up-color"></td>
           <td>${attribute.up_speed}${attribute.up_unit}</td>
           <td><ha-icon-button icon="mdi:turtle" title="turtle mode" id="turtle"></ha-icon-button></td>
           <td><ha-icon-button icon="mdi:stop" title="start/stop all" id="start"></ha-icon-button></td>
        </tr>
      `)[0]}
    `;
     const root = this.shadowRoot;
     root.getElementById('turtle').addEventListener('click', this._toggleTurtle.bind(this));
     root.getElementById('turtle').className = "turtle_" + this.myhass.states['switch.transmission_turtle_mode'].state;
     root.getElementById('start').addEventListener('click', this._startStop.bind(this));
     if ( this.myhass.states['switch.transmission_switch'].state == "on" ) {
       root.getElementById('start').icon = "mdi:stop";
     } else {
       root.getElementById('start').icon = "mdi:play";
     }
     root.getElementById('start').className = "start_" + this.myhass.states['switch.transmission_switch'].state;
  }

  set hass(hass) {
    const root = this.shadowRoot;
    this.myhass = hass;

    let attributes = this._getAttributes(hass);
    let gattributes = this._getGAttributes(hass);

    this._updateTitle(root.getElementById('title'), gattributes);
    this._updateContent(root.getElementById('attributes'), attributes);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('transmission-card', TransmissionCard);
