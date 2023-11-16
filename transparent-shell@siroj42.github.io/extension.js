import Main from 'imports/ui/main';
import { Gio } from 'imports.gi';
import { ExtensionUtils } from 'imports.misc.extensionUtils';

const Extension = ExtensionUtils.getCurrentExtension();

export const settingskeys = {
  "top-panel": 0,
  dash: 0,
  search: 0,
};

export const SHELL_TRANSPARENCY = "shell-transparency";

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
  this.settings = ExtensionUtils.getSettings();
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
