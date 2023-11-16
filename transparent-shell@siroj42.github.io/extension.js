import * as Main from "resource:///org/gnome/shell/ui/main.js";
import Gio from 'gi://Gio';

let extensionObject, extensionSettings;

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class shell_transparency extends Extension {
    enable() {
        this._settings = this.getSettings();
        console.log(_('This is a translatable text'));
    }

    disable() {
        this._settings = null;
    }
}

export function log_level() {
let settings = Extension.lookupByURL(import.meta.url).getSettings();
let log_level = settings.get_uint('log-level');
return log_level;
}

export const settingskeys = {
  "top-panel": 0,
  dash: 0,
  search: 0,
};

const SHELL_TRANSPARENCY = "shell-transparency";
export { SHELL_TRANSPARENCY };

export function init() {
  log("Starting transparent-shell extension");
}

export const toggleTransparency = (el, enabled = true) =>
  el &&
  el[enabled ? "add_style_class_name" : "remove_style_class_name"](
    SHELL_TRANSPARENCY
  );

export const componentToggles = {
  "top-panel": (isEnabled) => {
    try {
      [main.panel]
        .concat(main?.mmPanel)
        .filter((p) => !!p)
        .forEach((mmpanel) => {
          toggleTransparency(mmpanel, isEnabled);
          toggleTransparency(mmpanel._leftCorner, isEnabled);
          toggleTransparency(mmpanel._rightCorner, isEnabled);
        });
    } catch (error) {
      log(error);
    }
  },
  "dash": (isEnabled) =>
    toggleTransparency(overview._dash.actor, isEnabled),
  "search": (isEnabled) =>
    toggleTransparency(overview._searchEntry, isEnabled),
};

export const onChange = (_, key) => {
  const isEnabled = this.settings.get_boolean(key);
  if (componentToggles[key]) {
    componentToggles[key](isEnabled);
  }
};

export function enable() {
  this.settings = Extension.lookupByURL(import.meta.url).getSettings();
  Object.keys(settingskeys).forEach((key) => {
    if (this.settings.get_boolean(key)) {
      componentToggles[key](true);
    }
    settingskeys[key] = this.settings.connect("changed::" + key, () =>
      onChange(this.settings, key)
    );
  });
}

export function disable() {
  Object.keys(settingskeys).forEach((key) => {
    componentToggles[key](false);
    this.settings.disconnect(settingskeys[key]);
  });
  this.settings = null;
}
