const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;

const Extension = ExtensionUtils.getCurrentExtension();

const settingskeys = {
  "top-panel": 0,
  dash: 0,
  search: 0,
};

const SHELL_TRANSPARENCY = "shell-transparency";

function init() {
  log("Starting transparent-shell extension");
}

const toggleTransparency = (el, enabled = true) =>
  el &&
  el[enabled ? "add_style_class_name" : "remove_style_class_name"](
    SHELL_TRANSPARENCY
  );

const componentToggles = {
  "top-panel": (isEnabled) => {
    try {
      [Main.panel]
        .concat(Main?.mmPanel)
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
    toggleTransparency(Main.overview.dash._background, isEnabled),
  "search": (isEnabled) =>
    toggleTransparency(Main.overview.searchEntry, isEnabled),
};

const onChange = (_, key) => {
  const isEnabled = this.settings.get_boolean(key);
  if (componentToggles[key]) {
    componentToggles[key](isEnabled);
  }
};

function enable() {
  this.settings = ExtensionUtils.getSettings();
  Object.keys(settingskeys).forEach((key) => {
    if (this.settings.get_boolean(key)) {
      componentToggles[key](true);
    }
    settingskeys[key] = this.settings.connect("changed::" + key, onChange);
  });
}

function disable() {
  Object.keys(settingskeys).forEach((key) => {
    componentToggles[key](false);
    this.settings.disconnect(settingskeys[key]);
  });
  this.settings = null;
}
