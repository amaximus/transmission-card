const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const translations = {
  "en": {
    "sensor_state": {
      "idle": "Idle",
      "up_down": "Uploading/Downloading",
      "seeding": "Seeding",
      "downloading": "Downloading"
    },
    "torrent_state": {
      "stopped": "Stopped",
      "check_pending": "Check Pending",
      "checking": "Checking",
      "download_pending": "Download Pending",
      "downloading": "Downloading",
      "seed_pending": "Seed Pending",
      "seeding": "Seeding"
    },
    "torrent_types": {
      "total": "total",
      "active": "active",
      "completed": "completed",
      "paused": "paused",
      "started": "started"
    },
    "sort_types": {
      "name": "name",
      "added_date": "date added",
      "status": "status",
      "percent": "progress",
      "id": "id"
    },
    "sort_by": "Sort by",
    "torrent_link": "Torrent Link",
    "your_magnet_link": "Your magnet link",
    "start_all": "Start All",
    "stop_all": "Stop All",
    "turtle_mode": "Turtle Mode",
    "start": "Start",
    "stop": "Stop",
    "delete": "Delete torrent",
    "delete_data": "Delete torrent and data",
    "resume": "Resume",
    "pause": "Pause",
    "remove": "Remove",
    "delete_downloaded_data": "Delete downloaded data",
    "remove_warning": "Once removed, continuing the transfer will require the torrent file. Are you sure you want to remove it?",
    "cancel": "Cancel",
    "ratio": "Ratio",
    "eta": "ETA",
    "all": "all",
    "ascending": "ascending",
    "descending": "descending"
  },
  "pt-BR": {
    "sensor_state": {
      "idle": "Ocioso",
      "up_down": "Semeando/Baixando",
      "seeding": "Semeando",
      "downloading": "Baixando"
    },
    "torrent_state": {
      "stopped": "Parado",
      "check_pending": "VerificaÃ§Ã£o Pendente",
      "checking": "Verificando",
      "download_pending": "Download Pendente",
      "downloading": "Baixando",
      "seed_pending": "Semeadura Pendente",
      "seeding": "Semeando"
    },
    "torrent_types": {
      "total": "Todos",
      "active": "Ativos",
      "completed": "Completos",
      "paused": "Pausados",
      "started": "Iniciados"
    },
    "sort_types": {
      "name": "nome",
      "added_date": "data de adição",
      "status": "status",
      "percent": "progresso",
      "id": "id"
    },
    "sort_by": "Ordenar por",
    "torrent_link": "Link do Torrent",
    "your_magnet_link": "Seu link magnet",
    "start_all": "Iniciar Todos",
    "stop_all": "Parar Todos",
    "turtle_mode": "Modo Tartaruga",
    "start": "Iniciar",
    "stop": "Parar",
    "delete": "Remover torrent",
    "delete_data": "Remover torrent e arquivos",
    "resume": "Retomar",
    "pause": "Pausar",
    "remove": "Remover",
    "delete_downloaded_data": "Excluir dados baixados",
    "remove_warning": "Uma vez removido, continuar a transferência exigirá o arquivo torrent. Tem certeza de que deseja removê-lo?",
    "cancel": "Cancelar",
    "ratio": "Proporção",
    "eta": "ETA",
    "all": "todos",
    "ascending": "ascendente",
    "descending": "descendo"
  },
  "ru": {
    "sensor_state": {
      "idle": "Бездействие",
      "up_down": "Загрузка/Раздача",
      "seeding": "Раздача",
      "downloading": "Загрузка"
    },
    "torrent_state": {
      "stopped": "Остановлено",
      "check_pending": "Ожидание проверки",
      "checking": "Проверка",
      "download_pending": "Ожидание загрузки",
      "downloading": "Загрузка",
      "seed_pending": "Ожидание раздачи",
      "seeding": "Раздача"

    },
    "torrent_types": {
      "total": "Все",
      "active": "Активны",
      "completed": "Завершены",
      "paused": "Остановлены",
      "started": "Запущены"
    },
    "sort_types": {
      "name": "имя",
      "added_date": "дата добавления",
      "status": "статус",
      "percent": "прогресс",
      "id": "id"
    },
    "sort_by": "Сортировать по",
    "torrent_link": "Торрент ссылка",
    "your_magnet_link": "Magnet-ссылка",
    "start_all": "Запустить все",
    "stop_all": "Остановить все",
    "turtle_mode": "Режим черепахи",
    "start": "Запустить",
    "stop": "Остановить",
    "delete": "Удалить торрент",
    "delete_data": "Удалить торрент и данные",
    "resume": "Продолжить",
    "pause": "Пауза",
    "remove": "Удалить",
    "delete_downloaded_data": "Удалить загруженные данные",
    "remove_warning": "После удаления для продолжения загрузки потребуется торрент-файл. Вы уверены, что хотите удалить его?",
    "cancel": "Отмена",
    "ratio": "соотношение",
    "eta": "ETA",
    "all": "все",
    "ascending": "восходящий",
    "descending": "нисходящий"
  }
}

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

function sortDataBy (d, byKey, order){
  let sortedData;

  if (byKey == 'name') {
    sortedData = d.sort(function(a,b){
      let x = a.name;
      let y = b.name;
      if (order == "ascending") {
        if (x > y) { return 1; }
        if (x < y) { return -1; }
      } else if (order == "descending") {
        if (x < y) { return 1; }
        if (x > y) { return -1; }
      }
      return 0;
    });

  } else if (byKey == 'id') {
    sortedData = d.sort(function(a,b){
      if (order == "ascending") {
        return a.id - b.id;
      }
      return b.id - a.id;
    });
  } else if (byKey == 'added_date') {
    sortedData = d.sort(function(a,b){
      let x = new Date(a.added_date)
      let y = new Date(b.added_date)
      if (order == "ascending") {
        return x - y;
      } else if (order == "descending") {
        return y - x;
      }
      return 0;
    });
  } else if (byKey == 'percent') {
    sortedData = d.sort(function(a,b){
      if (order == "ascending") {
        return a.percent - b.percent;
      }
      return b.percent - a.percent;
    });
  } else if (byKey == 'status') {
    sortedData = d.sort(function(a,b){
      let x = a.status;
      let y = b.status;
      if (order == "ascending") {
        if (x > y) { return 1; }
        if (x < y) { return -1; }
        return 0;
      }
      if (x < y) { return 1; }
      if (x > y) { return -1; }
      return 0;
    });
  }
  return sortedData;
}

class TransmissionCard extends LitElement {

  static properties = {
    config: {},
    hass: {},
    selectedType: {},
    selectedSort: {},
    selectedOrder: {},
    selectedLimit: {},
    contextMenu: {},
    removeDialog: {},
  };

  constructor() {
    super();
    this.contextMenu = null;
    this.removeDialog = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onGlobalClick = () => {
      if (this.contextMenu) {
        this.contextMenu = null;
      }
    };
    this._onGlobalKeydown = (ev) => {
      if (ev.key === 'Escape') {
        if (this.contextMenu) this.contextMenu = null;
        if (this.removeDialog) this.removeDialog = null;
      }
    };
    window.addEventListener('click', this._onGlobalClick);
    window.addEventListener('contextmenu', this._onGlobalClick);
    window.addEventListener('keydown', this._onGlobalKeydown);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this._onGlobalClick);
    window.removeEventListener('contextmenu', this._onGlobalClick);
    window.removeEventListener('keydown', this._onGlobalKeydown);
    super.disconnectedCallback();
  }

  _getTorrents(hass, type, sort, order, limit, sensor_entity_id) {
    var res = [];
    const torrentsEntityId = this._resolveEntity(`${type}_torrents`, 'sensor', [`${type}_torrents`])
      || `sensor.${sensor_entity_id}_${type}_torrents`;
    if (typeof this.hass.states[torrentsEntityId] != "undefined") {
      const data1 = this.hass.states[torrentsEntityId].attributes['torrent_info'];
      Object.keys(data1 || {}).forEach(function (key) {
        res.push({
          name: key,
          id: data1[key].id,
          percent: parseInt(data1[key].percent_done, 10),
          status: data1[key].status,
          added_date: data1[key].added_date,
          eta: data1[key].eta,
          ratio: data1[key].ratio
        });
      });
    }

    // Filter seeding torrents if hide_seeding is enabled and type is 'active'
    if (this.config.hide_seeding && type === 'active') {
      res = res.filter(torrent => torrent.status !== 'seeding');
    }

    if ( limit != "all" ) {
      return sortDataBy(res, sort, order).slice(0, parseInt(limit));
    }
    return sortDataBy(res, sort, order);
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
    const precision = this.hass.entities[speedSensor]?.display_precision;
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

  _formatEta(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return 'Unknown';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }

  _getCustomColor(status) {
    if (!this.config.custom_colors) {
      return null;
    }

    if (status === 'downloading' && this.config.custom_colors.downloading) {
      return this.config.custom_colors.downloading;
    }
    if (status === 'seeding' && this.config.custom_colors.seeding) {
      return this.config.custom_colors.seeding;
    }
    if (status === 'stopped' && this.config.custom_colors.stopped) {
      return this.config.custom_colors.stopped;
    }

    return null;
  }

  _toggleTurtle() {
    this.hass.callService('switch', 'toggle', { entity_id: this.turtle_mode_entity_id });
  }

  _toggleSort(ev) {
    this.selectedSort = ev.target.value;
  }

  _toggleOrder() {
    this.selectedOrder = this.selectedOrder === 'ascending' ? 'descending' : 'ascending';
  }

  _toggleLimit(ev) {
    this.selectedLimit = ev.target.value;
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

  _openContextMenu(ev, torrent) {
    if (!this.config_entry) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.contextMenu = { x: ev.clientX, y: ev.clientY, torrent };
  }

  _contextResume() {
    const torrent = this.contextMenu?.torrent;
    this.contextMenu = null;
    if (torrent) {
      this.hass.callService('transmission', 'start_torrent', { entry_id: `${this.config_entry}`, id: torrent.id });
    }
  }

  _contextPause() {
    const torrent = this.contextMenu?.torrent;
    this.contextMenu = null;
    if (torrent) {
      this.hass.callService('transmission', 'stop_torrent', { entry_id: `${this.config_entry}`, id: torrent.id });
    }
  }

  _contextRemove() {
    const torrent = this.contextMenu?.torrent;
    if (torrent) {
      this._openRemoveDialog(torrent);
    }
  }

  _openRemoveDialog(torrent) {
    this.contextMenu = null;
    this.removeDialog = { torrent, deleteData: false };
  }

  _toggleDeleteData(ev) {
    this.removeDialog = { ...this.removeDialog, deleteData: ev.target.checked };
  }

  _cancelRemove() {
    this.removeDialog = null;
  }

  _confirmRemove() {
    const { torrent, deleteData } = this.removeDialog || {};
    this.removeDialog = null;
    if (torrent) {
      this.hass.callService('transmission', 'remove_torrent', { entry_id: `${this.config_entry}`, id: torrent.id, delete_data: deleteData });
    }
  }

  _addTorrent(event) {
    if (event.key !== 'Enter') return;
    this._submitAddTorrent(event.target);
  }

  _addTorrentClick() {
    const textfield = this.renderRoot.querySelector('#addTorrent input');
    if (textfield) {
      this._submitAddTorrent(textfield);
    }
  }

  _submitAddTorrent(textfield) {
    const torrentMagnet = textfield.value;
    if (!torrentMagnet) return;

    let payload = {
      entry_id: `${this.config_entry}`,
      torrent: torrentMagnet
    };

    if (this.config.default_download_dir) {
      payload.download_dir = this.config.default_download_dir;
    }

    this.hass.callService('transmission', 'add_torrent', payload);
    textfield.value = '';
  }

  get _transmissionDeviceId() {
    if (!this.hass || !this.hass.entities) return null;
    const prefix = this.config.sensor_entity_id;
    const platformMatches = [];
    let prefixMatch = null;
    for (const entity of Object.values(this.hass.entities)) {
      if (entity.platform !== 'transmission') continue;
      platformMatches.push(entity);
      if (!prefixMatch && prefix && (
        entity.entity_id.startsWith(`sensor.${prefix}_`) ||
        entity.entity_id.startsWith(`switch.${prefix}_`)
      )) {
        prefixMatch = entity;
      }
    }
    return (prefixMatch || platformMatches[0])?.device_id || null;
  }

  _resolveEntity(translationKey, domain, legacyNames = []) {
    if (!this.hass || !this.hass.entities) return null;
    const deviceId = this._transmissionDeviceId;

    if (deviceId) {
      for (const entity of Object.values(this.hass.entities)) {
        if (entity.platform !== 'transmission') continue;
        if (entity.device_id !== deviceId) continue;
        if (entity.translation_key !== translationKey) continue;
        if (!entity.entity_id.startsWith(`${domain}.`)) continue;
        return entity.entity_id;
      }
    }

    const prefix = this.config.sensor_entity_id;
    for (const name of legacyNames) {
      const base = `${domain}.${prefix}_${name}`;
      if (this.hass.states[base]) return base;
      for (let i = 2; i <= 9; i++) {
        const suffixed = `${base}_${i}`;
        if (this.hass.states[suffixed]) return suffixed;
      }
    }

    return null;
  }

  get download_speed_entity_id() {
    return this._resolveEntity('download', 'sensor', ['download_speed', 'down_speed'])
      || `sensor.${this.config.sensor_entity_id}_download_speed`;
  }

  get upload_speed_entity_id() {
    return this._resolveEntity('upload', 'sensor', ['upload_speed', 'up_speed'])
      || `sensor.${this.config.sensor_entity_id}_upload_speed`;
  }

  get turtle_mode_entity_id() {
    return this._resolveEntity('turtle_mode', 'switch', ['turtle_mode'])
      || `switch.${this.config.sensor_entity_id}_turtle_mode`;
  }

  get switch_entity_id() {
    return this._resolveEntity('on_off', 'switch', ['switch'])
      || `switch.${this.config.sensor_entity_id}_switch`;
  }

  get status_entity_id() {
    return this._resolveEntity('status', 'sensor', ['status'])
      || `sensor.${this.config.sensor_entity_id}_status`;
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
      'hide_sort': false,
      'default_sort': 'name',
      'hide_order': false,
      'default_order': 'ascending',
      'hide_limit': true,
      'default_limit': 'all',
      'hide_upload_speed': false,
      'hide_download_speed': false,
      'hide_status': false,
      'force_status_newline': false,
      'hide_seeding': false,
      'hide_eta': false,
      'hide_header_eta': false,
      'hide_ratio': false,
      'default_download_dir': '',
      'custom_colors': {
        'downloading': null,
        'seeding': null,
        'stopped': null
      }
    }

    this.config = {
      ...defaultConfig,
      ...config
    };

    this.selectedType = this.config.default_type;
    this.selectedSort = this.config.default_sort;
    this.selectedOrder = this.config.default_order;
    this.selectedLimit = this.config.default_limit;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const torrents = this._getTorrents(this.hass, this.selectedType, this.selectedSort, this.selectedOrder, this.selectedLimit, this.config.sensor_entity_id);
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
        ${this.renderContextMenu()}
        ${this.renderRemoveDialog()}
      </ha-card>
    `;
  }

  renderContextMenu() {
    if (!this.contextMenu) {
      return html``;
    }

    const lang = this.hass.config.language;
    const resumeLabel = translations[lang]?.resume || translations['en'].resume;
    const pauseLabel = translations[lang]?.pause || translations['en'].pause;
    const removeLabel = translations[lang]?.remove || translations['en'].remove;

    const x = Math.min(this.contextMenu.x, window.innerWidth - 180);
    const y = Math.min(this.contextMenu.y, window.innerHeight - 140);

    return html`
      <div class="context-menu" style="left: ${x}px; top: ${y}px;" @click=${(ev) => ev.stopPropagation()}>
        <button class="context-item" @click=${this._contextResume}>
          <ha-icon icon="mdi:play"></ha-icon>${resumeLabel}
        </button>
        <button class="context-item" @click=${this._contextPause}>
          <ha-icon icon="mdi:pause"></ha-icon>${pauseLabel}
        </button>
        <div class="context-separator"></div>
        <button class="context-item remove" @click=${this._contextRemove}>
          <ha-icon icon="mdi:close"></ha-icon>${removeLabel}
        </button>
      </div>
    `;
  }

  renderRemoveDialog() {
    if (!this.removeDialog) {
      return html``;
    }

    const lang = this.hass.config.language;
    const removeLabel = translations[lang]?.remove || translations['en'].remove;
    const cancelLabel = translations[lang]?.cancel || translations['en'].cancel;
    const deleteDataLabel = translations[lang]?.delete_downloaded_data || translations['en'].delete_downloaded_data;
    const warning = translations[lang]?.remove_warning || translations['en'].remove_warning;

    return html`
      <div class="dialog-backdrop" @click=${this._cancelRemove}>
        <div class="remove-dialog" role="dialog" aria-modal="true" @click=${(ev) => ev.stopPropagation()}>
          <h3>${removeLabel} ${this.removeDialog.torrent.name}?</h3>
          <label class="delete-data-label">
            <input
              type="checkbox"
              .checked=${this.removeDialog.deleteData}
              @change=${this._toggleDeleteData}
            />
            ${deleteDataLabel}
          </label>
          <p class="remove-warning">${warning}</p>
          <div class="dialog-buttons">
            <button class="dialog-button" @click=${this._cancelRemove}>${cancelLabel}</button>
            <button class="dialog-button danger" @click=${this._confirmRemove}>${removeLabel}</button>
          </div>
        </div>
      </div>
    `;
  }

  renderTitle() {
    const gattributes = this._getGAttributes();
    const showTurtle = !this.config.hide_turtle
      && typeof this.hass.states[this.turtle_mode_entity_id] != "undefined";
    const showStartStop = !this.config.hide_startstop
      && typeof this.hass.states[this.switch_entity_id] != "undefined";

    return html
    `
      <div id="toolbar">
        <div class="toolbar-row">
          ${this.renderStatus(gattributes)}
          <div class="spacer"></div>
          ${this.renderDownloadSpeed(gattributes)}
          ${this.renderUploadSpeed(gattributes)}
        </div>
        <div class="toolbar-row">
          ${this.renderTypeSelect()}
          ${showTurtle || showStartStop ? html`
            <div class="titleitem action-chips">
              ${showTurtle ? this.renderTurtleButton() : ''}
              ${showStartStop ? this.renderStartStopButton() : ''}
            </div>
          ` : ''}
          <div class="spacer"></div>
          ${this.renderSortSelect()}
          ${this.renderLimitSelect()}
        </div>
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
        <input
          type="text"
          placeholder="${translations[this.hass.config.language]?.your_magnet_link || translations['en'].your_magnet_link}"
          name="addTorrent"
          @keypress="${this._addTorrent}"
          aria-label="${translations[this.hass.config.language]?.torrent_link || translations['en'].torrent_link}"
        />
        <ha-icon-button
          class="add_torrent_button"
          @click="${this._addTorrentClick}"
          title="${translations[this.hass.config.language]?.torrent_link || translations['en'].torrent_link}"
          aria-label="${translations[this.hass.config.language]?.torrent_link || translations['en'].torrent_link}">
          <ha-icon icon="mdi:send"></ha-icon>
        </ha-icon-button>
      </div>
    `
  }

  renderTorrent(torrent) {
    const customColor = this._getCustomColor(torrent.status);
    const colorStyle = customColor ? `background-color: ${customColor};` : '';
    const etaLabel = this.config.hide_header_eta ? '' : `${translations[this.hass.config.language]?.eta || translations['en'].eta}: `;

    return html`
      <div class="progressbar" @contextmenu=${(ev) => this._openContextMenu(ev, torrent)}>
        <div class="${torrent.status} progressin" style="width:${torrent.percent}%; ${colorStyle}"></div>
        <div class="name">${torrent.name}</div>
        ${this.config.hide_eta || !Number.isFinite(torrent.eta) || torrent.eta < 0 ? '' : html`<div class="eta">${etaLabel}${this._formatEta(torrent.eta)}</div>`}
        <div class="percent">${torrent.percent}%</div>
      </div>
    `;
  }

  renderTorrentFull(torrent) {
    const customColor = this._getCustomColor(torrent.status);
    const colorStyle = customColor ? `background-color: ${customColor};` : '';

    return html`
    <div class="torrent" @contextmenu=${(ev) => this._openContextMenu(ev, torrent)}>
      <div class="torrent_name">${torrent.name}</div>
      <div class="torrent_state">${translations[this.hass.config.language]?.torrent_state[torrent.status] || translations['en'].torrent_state[torrent.status] || torrent.status}</div>
      <div class="progressbar">
        <div class="${torrent.status} progressin" style="width:${torrent.percent}%; ${colorStyle}">
        </div>
      </div>
      <div class="torrent_details">
        ${torrent.percent} %
        ${this.config.hide_ratio ? '' : ` - ${translations[this.hass.config.language]?.ratio || translations['en'].ratio}: ${torrent.ratio.toFixed(2)}`}
        ${this.config.hide_eta || !Number.isFinite(torrent.eta) || torrent.eta < 0 ? '' : ` - ${this.config.hide_header_eta ? '' : `${translations[this.hass.config.language]?.eta || translations['en'].eta}: `}${this._formatEta(torrent.eta)}`}
      </div>
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
    const label = isActive ? translations[this.hass.config.language]?.stop || translations['en'].stop : translations[this.hass.config.language]?.start || translations['en'].start;
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

    const label = deleteData ? translations[this.hass.config.language]?.delete_data || translations['en'].delete_data : translations[this.hass.config.language]?.delete || translations['en'].delete;
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

  renderStatus(gattributes) {
    if (this.config.hide_status) {
      return html``;
    }

    const status = gattributes.status;
    const statusClass = this.config.force_status_newline ? "status-newline": "";


    return html`
      <div class="status titleitem c-${status.replace('/', '')} ${statusClass}" @click="${this._show_status}">
        <p>${translations[this.hass.config.language]?.sensor_state[status] || translations['en'].sensor_state[status] || status}</p>
      </div>
    `;
  }

  renderDownloadSpeed(gattributes) {
    if (this.config.hide_download_speed) {
      return html``;
    }

    return html`
      <div class="titleitem" @click="${this._show_download_speed}">
        <ha-icon icon="mdi:download" class="down down-color"></ha-icon>
        <span>${gattributes.down_speed} ${gattributes.down_unit}</span>
      </div>
    `;
  }

  renderUploadSpeed(gattributes) {
    if (this.config.hide_upload_speed) {
      return html``;
    }

    return html`
      <div class="titleitem" @click="${this._show_upload_speed}">
        <ha-icon icon="mdi:upload" class="up up-color"></ha-icon>
        <span>${gattributes.up_speed} ${gattributes.up_unit}</span>
      </div>
    `;
  }

  renderTurtleButton() {
    const state = this.hass.states[this.turtle_mode_entity_id].state;
    const title = translations[this.hass.config.language]?.turtle_mode || translations['en'].turtle_mode;
    return html`
      <button
        class="action-chip turtle_${state}"
        @click="${this._toggleTurtle}"
        title="${title}"
        aria-label="${title}"
        id="turtle">
        <ha-icon icon="mdi:turtle"></ha-icon>
      </button>
    `;
  }

  renderStartStopButton() {
    const state = this.hass.states[this.switch_entity_id].state;
    const isOn = state === 'on';
    const icon = isOn ? 'mdi:stop' : 'mdi:play';
    const title = isOn ? translations[this.hass.config.language]?.stop_all || translations['en'].stop_all : translations[this.hass.config.language]?.start_all || translations['en'].start_all;
    return html`
      <button
        class="action-chip start_${state}"
        @click="${this._startStop}"
        title="${title}"
        aria-label="${title}"
        id="start">
        <ha-icon icon="${icon}"></ha-icon>
      </button>
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

    const types = [
      { value: 'total', icon: 'mdi:format-list-bulleted' },
      { value: 'active', icon: 'mdi:play' },
      { value: 'completed', icon: 'mdi:check' },
      { value: 'paused', icon: 'mdi:pause' },
    ];
    const labels = translations[this.hass.config.language]?.torrent_types || translations['en'].torrent_types;

    return html`
      <div class="titleitem type-select type-chips" role="tablist">
        ${types.map(t => html`
          <button
            class="type-chip ${this.selectedType === t.value ? 'selected' : ''}"
            role="tab"
            aria-selected="${this.selectedType === t.value}"
            title="${labels[t.value]}"
            aria-label="${labels[t.value]}"
            @click=${() => { this.selectedType = t.value; }}
          >
            <ha-icon icon="${t.icon}"></ha-icon>
          </button>
        `)}
      </div>
    `;
  }

  renderSortSelect() {
    if (this.config.hide_sort) {
      return html``;
    }

    const t = translations[this.hass.config.language] || translations['en'];
    const labels = t.sort_types || translations['en'].sort_types;
    const sortByLabel = t.sort_by || translations['en'].sort_by;
    const options = ['name', 'added_date', 'percent', 'status'].map(value => ({
      value,
      label: labels[value] || translations['en'].sort_types[value]
    }));

    const isAscending = this.selectedOrder === 'ascending';
    const orderLabel = isAscending
      ? t.ascending || translations['en'].ascending
      : t.descending || translations['en'].descending;

    return html`
      <div class="sort-control">
        <select
          class="sort-select"
          .value=${this.selectedSort}
          @change=${this._toggleSort}
          title="${sortByLabel}"
          aria-label="${sortByLabel}"
        >
          ${options.map(o => html`
            <option value="${o.value}" ?selected=${this.selectedSort === o.value}>${o.label}</option>
          `)}
        </select>
        ${this.config.hide_order ? '' : html`
          <button
            class="order-button"
            @click=${this._toggleOrder}
            title="${orderLabel}"
            aria-label="${orderLabel}"
          >
            <ha-icon icon="${isAscending ? 'mdi:sort-ascending' : 'mdi:sort-descending'}"></ha-icon>
          </button>
        `}
      </div>
    `;
  }

  renderLimitSelect() {
    if (this.config.hide_limit) {
      return html``;
    }

    const allLabel = translations[this.hass.config.language]?.all || translations['en'].all;

    return html`
      <div class="sort-control">
        <select
          class="sort-select"
          .value=${this.selectedLimit}
          @change=${this._toggleLimit}
        >
          ${['5', '10', '15', 'all'].map(value => html`
            <option value="${value}" ?selected=${this.selectedLimit === value}>${value === 'all' ? allLabel : value}</option>
          `)}
        </select>
      </div>
    `;
  }

  getCardSize() {
    return 1;
  }

  static get styles() {
    return css`
    .card-header {
      padding: 16px 20px 12px;
      line-height: 1.3;
    }
    #attributes {
      margin-top: 12px;
      padding-bottom: 16px;
    }
    .progressbar {
      border-radius: 0.4em;
      margin: 0 20px 6px;
      height: 1.4em;
      display: flex;
      background-color: var(--secondary-background-color);
      z-index: 0;
      position: relative;
    }
    #attributes .progressbar:last-child {
      margin-bottom: 0;
    }
    .progressin {
      border-radius: 0.4em;
      height: 100%;
      z-index: 1;
      position: absolute;
    }
    .name {
      margin-left: 0.7em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
      z-index: 2;
      color: var(--primary-text-color);
      line-height: 1.4em;
      flex-shrink: 1;
    }
    .eta {
      z-index: 2;
      margin-left: 0.7em;
      margin-right: 0.7em;
      color: var(--primary-text-color);
      line-height: 1.4em;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .percent {
      vertical-align: middle;
      z-index: 2;
      margin-left: auto;
      margin-right: 0.7em;
      color: var(--primary-text-color);
      line-height: 1.4em;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .context-menu {
      position: fixed;
      z-index: 1000;
      min-width: 160px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      background-color: var(--card-background-color, var(--ha-card-background, #fff));
      border: 1px solid var(--divider-color);
      border-radius: 0.5em;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .context-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 0.9em;
      font-family: inherit;
      text-align: left;
      border-radius: 0.35em;
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .context-item:hover {
      background-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .context-item.remove:hover {
      background-color: var(--error-color, #db4437);
    }
    .context-separator {
      height: 1px;
      margin: 4px 8px;
      background-color: var(--divider-color);
    }
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .remove-dialog {
      max-width: 420px;
      width: calc(100% - 48px);
      box-sizing: border-box;
      padding: 20px;
      background-color: var(--card-background-color, var(--ha-card-background, #fff));
      border-radius: 0.7em;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    .remove-dialog h3 {
      margin: 0 0 12px;
      font-size: 1em;
      color: var(--primary-text-color);
      word-break: break-word;
    }
    .delete-data-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 0.9em;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .remove-warning {
      margin: 0 0 16px;
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .dialog-button {
      padding: 6px 14px;
      border: 1px solid var(--divider-color);
      border-radius: 0.4em;
      background: transparent;
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 0.9em;
      cursor: pointer;
    }
    .dialog-button:hover {
      background-color: var(--secondary-background-color);
    }
    .dialog-button.danger {
      border-color: transparent;
      background-color: var(--error-color, #db4437);
      color: #fff;
    }
    .dialog-button.danger:hover {
      background-color: var(--error-color, #db4437);
      filter: brightness(1.1);
    }
    .downloading {
      background-color: var(--accent-color);
      background-color: color-mix(in srgb, var(--accent-color) 80%, var(--card-background-color));
    }
    .c-Downloading, .c-UpDown {
      color: var(--accent-color);
    }
    .seeding {
      background-color: var(--light-primary-color);
      background-color: color-mix(in srgb, var(--light-primary-color) 75%, var(--card-background-color));
    }
    .c-seeding {
      color: var(--primary-color);
    }
    .stopped {
      background-color: var(--label-badge-grey);
      background-color: color-mix(in srgb, var(--label-badge-grey) 40%, var(--card-background-color));
    }
    .c-idle {
      color: var(--label-badge-grey);
    }
    .up, .down {
      --mdc-icon-size: 18px;
    }
    .up-color {
      color: var(--primary-color);
    }
    .down-color {
      color: var(--accent-color);
    }

    #title {
      position: relative;
      display: inline-block;
      width: 100%;
    }
    #toolbar {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0 20px;
      padding: 8px 10px;
      background-color: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 0.6em;
      box-sizing: border-box;
    }
    .toolbar-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      min-height: 32px;
    }
    .spacer {
      flex: 1;
    }
    #addTorrent {
      display: flex;
      align-items: center;
      gap: 0.4em;
      margin: 0 20px 12px;
    }
    #addTorrent input {
      flex: 1;
      min-width: 0;
      padding: 0.5em 0.7em;
      font-size: 1em;
      color: var(--primary-text-color);
      background-color: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 0.4em;
      outline: none;
    }
    #addTorrent input:focus {
      border-color: var(--primary-color);
    }
    #addTorrent input::placeholder {
      color: var(--secondary-text-color);
    }
    .add_torrent_button {
      color: var(--primary-color);
      flex-shrink: 0;
    }
    .titleitem {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      font-size: 0.9em;
      white-space: nowrap;
    }
    .type-chips, .action-chips {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 2px;
      background-color: var(--card-background-color, var(--ha-card-background));
      border: 1px solid var(--divider-color);
      border-radius: 0.5em;
    }
    .action-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      margin: 0;
      border: none;
      background: transparent;
      border-radius: 0.35em;
      cursor: pointer;
      transition: background-color 0.15s ease;
      --mdc-icon-size: 18px;
    }
    .action-chip:hover {
      background-color: var(--divider-color);
    }
    .action-chip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    .sort-control {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 2px 4px 2px 10px;
      background-color: var(--card-background-color, var(--ha-card-background));
      border: 1px solid var(--divider-color);
      border-radius: 0.5em;
    }
    .sort-select {
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 0.85em;
      font-family: inherit;
      cursor: pointer;
      outline: none;
      padding: 2px 0;
      max-width: 7.5em;
    }
    .sort-select option {
      background-color: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .order-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      padding: 0;
      margin: 0;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      border-radius: 0.35em;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
      --mdc-icon-size: 16px;
    }
    .order-button:hover {
      background-color: var(--divider-color);
      color: var(--primary-text-color);
    }
    .order-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    .type-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      margin: 0;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      border-radius: 0.35em;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
      --mdc-icon-size: 18px;
    }
    .type-chip:hover {
      background-color: var(--divider-color);
      color: var(--primary-text-color);
    }
    .type-chip.selected {
      background-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .type-chip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    .status {
      font-size: 0.9em;
      font-weight: 500;
      align-self: center;
    }
    .status p {
      margin: 0;
      line-height: 1;
    }
    .status-newline {
      width: 100%;
      text-align: left;
    }
    .turtle_off {
      color: var(--secondary-text-color);
    }
    .turtle_on {
      color: var(--accent-color);
    }
    .start_on {
      color: var(--primary-color);
    }
    .start_off {
      color: var(--primary-color);
    }
    .no-torrent {
      margin-left: 20px;
    }
    .torrents {
      margin-left: 20px;
      margin-right: 20px;
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
      "name name"
      "state button"
      "progress button"
      "details button";
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
