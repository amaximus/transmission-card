const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element.config.entity] !==
        element.hass.states[element.config.entity]
    );
  }

  return true;
}

function sortDataBy (d, byKey){
  let sortedData;

  if (byKey == 'name') {
    sortedData = d.sort(function(a,b){
      let x = a.name;
      let y = b.name;
      if (x > y) { return 1; }
      if (x < y) { return -1; }
      return 0;
    });

  } else if (byKey == 'id') {
    sortedData = d.sort(function(a,b){
      return a.id - b.id;
    });
  } else if (byKey == 'added_date') {
    sortedData = d.sort(function(a,b){
      return a.added_date - b.added_date;
    });
  } else if (byKey == 'status') {
    sortedData = d.sort(function(a,b){
      let x = a.status;
      let y = b.status;
      if (x > y) { return 1; }
      if (x < y) { return -1; }
      return 0;
    });
  }
  return sortedData;
}

const torrent_types = ['total','active','completed','paused','started'];
const sort_types = ['name','added_date','id','status'];

class TransmissionCard extends LitElement {

  static get properties() {
    return {
      config: {},
      hass: {},
      selectedType: {state: true},
      selectedSort: {state: true}
    };
  }

  _getTorrents(hass, type, sort, sensor_entity_id) {
    var res = [];
    if (typeof this.hass.states[`sensor.${sensor_entity_id}_${type}_torrents`] != "undefined") {
      const data1 = this.hass.states[`sensor.${sensor_entity_id}_${type}_torrents`].attributes['torrent_info'];
      Object.keys(data1 || {}).forEach(function (key) {
        res.push({
          name: key,
          id: data1[key].id,
          percent: parseInt(data1[key].percent_done, 10),
          status: data1[key].status,
          added_date: data1[key].added_date,
          eta: data1[key].eta,
        });
      });
    }
    return sortDataBy(res, sort);
  }

  _getGAttributes() {
    let sensor_entity_id = this.config.sensor_entity_id;

    if (typeof this.hass.states[this.download_speed_entity_id] != "undefined") {
      return {
        down_speed: this._formatSpeed(this.hass, this.download_speed_entity_id),
        down_unit: this.hass.states[this.download_speed_entity_id].attributes['unit_of_measurement'],
        up_speed: this._formatSpeed(this.hass, this.upload_speed_entity_id),
        up_unit: this.hass.states[this.upload_speed_entity_id].attributes['unit_of_measurement'],
        status: this.hass.states[this.status_entity_id].state
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

  _formatSpeed(hass, speedSensor) {
    const precision = this.hass.entities[speedSensor].display_precision;
    if (Intl) {
      return Intl.NumberFormat(
        hass.locale.language,
        {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        }).format(this.hass.states[speedSensor].state);
    }

    return parseFloat(this.hass.states[speedSensor].state).toFixed(precision);
  }

  _toggleTurtle() {
    this.hass.callService('switch', 'toggle', { entity_id: this.turtle_mode_entity_id });
  }

  _toggleType(ev) {
    this.selectedType = ev.target.value;
  }

  _toggleSort(ev) {
    this.selectedSort = ev.target.value;
  }

  _startStop() {
    this.hass.callService('switch', 'toggle', { entity_id: this.switch_entity_id });
  }

  _startTorrent(event) {
    const torrentId = event.currentTarget.dataset.torrentId;
    this.hass.callService('transmission', 'start_torrent', { entry_id: `${this.config_entry}`, id: torrentId });
  }

  _stopTorrent(event) {
    const torrentId = event.currentTarget.dataset.torrentId;
    this.hass.callService('transmission', 'stop_torrent', { entry_id: `${this.config_entry}`, id: torrentId });
  }

  _deleteTorrent(event) {
    const torrentId = event.currentTarget.dataset.torrentId;
    const deleteData = event.currentTarget.dataset.deleteData;
    this.hass.callService('transmission', 'remove_torrent', { entry_id: `${this.config_entry}`, id: torrentId, delete_data: deleteData });
  }

  _addTorrent(event) {
    if (event.key !== 'Enter') return;
    const torrentMagnet = event.target.value;
    this.hass.callService('transmission', 'add_torrent', { entry_id: `${this.config_entry}`, torrent: torrentMagnet });
    event.target.value = '';
  }

  get download_speed_entity_id() {
    let download_speed = `sensor.${this.config.sensor_entity_id}_download_speed`;
    if (typeof this.hass.states[download_speed] != "undefined") {
      return download_speed;
    }
    return `sensor.${this.config.sensor_entity_id}_down_speed`;
  }

  get upload_speed_entity_id() {
    let upload_speed = `sensor.${this.config.sensor_entity_id}_upload_speed`;
    if (typeof this.hass.states[upload_speed] != "undefined") {
      return upload_speed;
    }
    return `sensor.${this.config.sensor_entity_id}_up_speed`;
  }

  get turtle_mode_entity_id() {
    return `switch.${this.config.sensor_entity_id}_turtle_mode`;
  }

  get switch_entity_id() {
    return `switch.${this.config.sensor_entity_id}_switch`;
  }

  get status_entity_id() {
    return `sensor.${this.config.sensor_entity_id}_status`;
  }

  get status_entity() {
    return this.hass.entities[this.status_entity_id];
  }

  get device() {
    return this.hass.devices[this.status_entity.device_id];
  }

  get config_entry() {
    return this.device.config_entries[0];
  }

  setConfig(config) {
    if (config.display_mode &&
      !['compact', 'full'].includes(config.display_mode)) {
        throw new Error('display_mode accepts only "compact" and "full" as value');
      }

    const defaultConfig = {
      'no_torrent_label': 'No torrents',
      'hide_turtle': false,
      'hide_startstop': false,
      'hide_type': false,
      'default_type': 'total',
      'display_mode': 'compact',
      'sensor_name': 'transmission',
      'sensor_entity_id': 'transmission',
      'header_text': 'Transmission',
      'hide_header': false,
      'hide_add_torrent': false,
      'hide_delete_torrent': false,
      'hide_delete_torrent_full': false,
      'hide_torrent_list': false,
      'hide_sort': true,
      'default_sort': 'name',
    }

    this.config = {
      ...defaultConfig,
      ...config
    };

    this.selectedType = this.config.default_type;
    this.selectedSort = this.config.default_sort;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const torrents = this._getTorrents(this.hass, this.selectedType, this.selectedSort, this.config.sensor_entity_id);
    return html`
      <ha-card>
        <div class="card-header">
          ${this.renderCardHeader()}
        </div>
        ${this.renderAddTorrent()}
        <div>
          <div id="title">
              ${this.renderTitle()}
          </div>
          <div id="attributes">
          ${ ! this.config.hide_torrent_list
               ? torrents.length > 0
                 ? this.config.display_mode === 'compact'
                   ? html`${torrents.map(torrent => this.renderTorrent(torrent))}`
                   : html`
                     <div class="torrents">
                       ${torrents.map(torrent => this.renderTorrentFull(torrent))}
                     </div>`
               : html`<div class="no-torrent">${this.config.no_torrent_label}</div>`
             : html``
          }
          </div>
        </div>
      </ha-card>
    `;
  }

  renderTitle() {
    const gattributes = this._getGAttributes();
    return html
    `
      <div id="title1">
        <div class="status titleitem c-${gattributes.status.replace('/','')}" @click="${this._show_status}">
          <p>${gattributes.status}<p>
        </div>
        <div class="titleitem" @click="${this._show_download_speed}">
          <ha-icon icon="mdi:download" class="down down-color"></ha-icon>
          <span>${gattributes.down_speed} ${gattributes.down_unit}</span>
        </div>
        <div class="titleitem" @click="${this._show_upload_speed}">
          <ha-icon icon="mdi:upload" class="up up-color"></ha-icon>
          <span>${gattributes.up_speed} ${gattributes.up_unit}</span>
        </div>
        ${this.renderTurtleButton()}
        ${this.renderStartStopButton()}
        ${this.renderTypeSelect()}
        ${this.renderSortSelect()}
      </div>
    `;
  }

  _show_more_info(entity_id) {
    let e = new Event("hass-more-info", { composed: true });
    e.detail = {
      entityId: entity_id
    };
    this.dispatchEvent(e);
  }

  _show_download_speed() {
    this._show_more_info(this.download_speed_entity_id);
  }

  _show_upload_speed() {
    this._show_more_info(this.upload_speed_entity_id);
  }

  _show_status() {
    this._show_more_info(this.status_entity_id);
  }

  renderAddTorrent() {
    if (this.config.hide_add_torrent) {
      return html``;
    }

    return html
    `
      <div id="addTorrent">
        <ha-textfield
          placeholder="Your magnet link"
          name="addTorrent"
          @keypress="${this._addTorrent}"
          label="Torrent link">
        </ha-textfield>
      </div>
    `
  }

  renderTorrent(torrent) {
    return html
    `
      <div class="progressbar">
          <div class="${torrent.status} progressin" style="width:${torrent.percent}%">
          </div>
          <div class="name">${torrent.name}</div>
        <div class="percent">${torrent.percent}%</div>
      </div>
    `;
  }

  renderTorrentFull(torrent) {
    return html`
    <div class="torrent">
      <div class="torrent_name">${torrent.name}</div>
      <div class="torrent_state">${torrent.status}</div>
      <div class="progressbar">
        <div class="${torrent.status} progressin" style="width:${torrent.percent}%">
        </div>
      </div>
      <div class="torrent_details">${torrent.percent} %</div>
      <div class="torrent-buttons">
        ${this.renderTorrentButton(torrent)}
        ${this.renderTorrentDeleteButton(torrent, false)}
        ${this.renderTorrentDeleteButton(torrent, true)}
      </div>
    </div>
    `
  }

  renderTorrentButton(torrent) {
    if (!this.config_entry) {
      return html``;
    }
    const activeTorrentStatus = ['seeding', 'downloading']
    const isActive = activeTorrentStatus.includes(torrent.status);
    const label = isActive ? 'Stop' : 'Start';
    const icon = isActive ? 'mdi:stop' : 'mdi:play';

    return html`
      <ha-icon-button
        class="start_${torrent.status}"
        data-torrent-id=${torrent.id}
        @click="${isActive ? this._stopTorrent : this._startTorrent}"
        title="${label}"
        aria-label="${label}"
        >
          <ha-icon
            icon="${icon}">
          </ha-icon>
      </ha-icon-button>`
  }

  renderTorrentDeleteButton(torrent, deleteData) {
    if (!this.config_entry) {
      return html``;
    }

    if (
      this.config.hide_delete_torrent && !deleteData
      || this.config.hide_delete_torrent_full && deleteData
    ) {
      return html``;
    }

    const label = deleteData ? 'Delete with data' : 'Delete';
    const icon = deleteData ? 'mdi:delete' : 'mdi:close';

    return html`
      <ha-icon-button
        class="start_${torrent.status}"
        data-torrent-id=${torrent.id}
        data-delete-data=${deleteData}
        @click="${this._deleteTorrent}"
        title="${label}"
        aria-label="${label}"
        >
          <ha-icon
            icon="${icon}">
          </ha-icon>
      </ha-icon-button>`
  }

  renderTurtleButton() {
    if (this.config.hide_turtle) {
      return html``;
    }

    if (typeof this.hass.states[this.turtle_mode_entity_id] == "undefined") {
      return html``;
    }

    const state = this.hass.states[this.turtle_mode_entity_id].state;
    return html`
      <div class="titleitem">
        <ha-icon-button
          class="turtle_${state}"
          @click="${this._toggleTurtle}"
          title="turtle mode"
          id="turtle">
          <ha-icon icon="mdi:turtle"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  renderStartStopButton() {
    if (this.config.hide_startstop) {
      return html``;
    }

    if (typeof this.hass.states[this.switch_entity_id] == "undefined") {
      return html``;
    }

    const state = this.hass.states[this.switch_entity_id].state;
    const isOn = state === 'on';
    const icon = isOn ? 'mdi:stop' : 'mdi:play';
    const title = isOn ? 'Stop All' : 'Play All';
    return html`
      <div class="titleitem">
        <ha-icon-button
          class="start_${state}"
          @click="${this._startStop}"
          title="${title}"
          id="start">
          <ha-icon icon="${icon}">
          </ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  renderCardHeader() {
    if (this.config.hide_header) {
      return html``;
    }
    return html`
      <div>
        ${this.config.header_text}
      </div>
    `;
  }

  renderTypeSelect() {
    if (this.config.hide_type) {
      return html``;
    }

    return html`
      <div class="titleitem">
        <ha-select
          class="type-dropdown"
          .label=${this.label}
          @selected=${this._toggleType}
          .value=${this.selectedType}
          fixedMenuPosition
          naturalMenuWidth
        >
          ${torrent_types.map(
            (type) => html`
              <mwc-list-item .value=${type}>${type}</mwc-list-item>`
          )}
        </ha-select>
      </div>
    `;
  }

  renderSortSelect() {
    if (this.config.hide_sort) {
      return html``;
    }

    return html`
      <div class="titleitem">
        <ha-select
          class="type-dropdown"
          .label=${this.label}
          @selected=${this._toggleSort}
          .value=${this.selectedSort}
          fixedMenuPosition
          naturalMenuWidth
        >
          ${sort_types.map(
            (type) => html`
              <mwc-list-item .value=${type}>${type}</mwc-list-item>`
          )}
        </ha-select>
      </div>
    `;
  }

  getCardSize() {
    return 1;
  }

  static get styles() {
    return css`
    #attributes {
      margin-top: 0.4em;
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
      line-height: 1.4em;
    }
    .percent {
      vertical-align: middle;
      z-index: 2;
      margin-left: 1.7em;
      margin-right: 0.7em;
      color: var(--text-light-primary-color, var(--primary-text-color));
      line-height: 1.4em;
    }
    .downloading {
      background-color: var(--accent-color);
    }
    .c-Downloading, .c-UpDown {
      color: var(--accent-color);
    }
    .seeding {
      background-color: var(--light-primary-color);
    }
    .c-seeding {
      color: var(--light-primary-color);
    }
    .stopped {
      background-color: var(--label-badge-grey);
    }
    .c-idle {
      color: var(--label-badge-grey);
    }
    .up, .down {
      display: inline-block;
      padding-top: 12px;
    }
    .up-color {
      color: var(--light-primary-color);
    }
    .down-color {
      color: var(--accent-color);
    }

    #title {
      position: relative;
      display: inline;
      width: 100%;
    }
    #title1 {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      line-height: 2.5rem;
    }
    #addTorrent {
      margin-left: 1.4em;
      margin-right: 1.4em;
      margin-bottom: 1rem;
    }
    #addTorrent ha-textfield{
      width: 100%;
    }
    .titleitem {
      width: auto;
      margin-left: 0.7em;
    }
    .status {
      font-size: 1em;
    }
    .turtle_off {
      color: var(--light-primary-color);
    }
    .turtle_on {
      color: var(--accent-color);
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
    .type-dropdown {
      width: 100px;
    }
    .torrents {
      margin-left: 1.4em;
      margin-right: 1.4em;
    }
    .torrent:not(:last-child) {
      border-bottom: 1px solid var(--divider-color);
    }
    .torrents .progressbar {
      margin: 0 0 0 0;
      height: 4px;
    }
    .torrent {
      display: grid;
      grid-template-areas:
      "name     name"
      "state    button"
      "progress button"
      "details  button";
      grid-template-columns: 1fr auto;
      grid-column-gap: 1em;
    }
    .torrent_name {
      grid-area: name;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .torrent_state {
      grid-area: state;
      font-size: 0.7em;
      text-transform: capitalize;
    }
    .torrent_details {
      grid-area: details;
      font-size: 0.7em;
    }
    .torrent-buttons {
      grid-area: button;
    }
    `;
  }
}

if (!customElements.get('transmission-card')) {
  customElements.define('transmission-card', TransmissionCard);
}

// Puts card into the UI card picker dialog
(window).customCards = (window).customCards || [];
(window).customCards.push({
  type: 'transmission-card',
  name: 'Transmission Card',
  preview: true,
  description: 'This Lovelace custom card displays torrents information provided by the Transmission Integration.',
});
