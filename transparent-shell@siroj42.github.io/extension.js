const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;

const Extension = ExtensionUtils.getCurrentExtension();

const gschema = Gio.SettingsSchemaSource.new_from_directory(
  Extension.dir.get_child("schemas").get_path(),
  Gio.SettingsSchemaSource.get_default(),
  false
);

const settings = new Gio.Settings({
  settings_schema: gschema.lookup(
    "org.gnome.shell.extensions.transparent-shell",
    true
  ),
});

const settingskeys = {
  "top-panel": 0,
  dash: 0,
  search: 0,
};

const SHELL_TRANSPARENCY = "shell-transparency";

function init() {
  log("Starting transparent-shell extension");
}

const toggleTransparency = (el, enabled = true) => {
  if (el) {
    el[enabled ? "add_style_class_name" : "remove_style_class_name"](
      SHELL_TRANSPARENCY
    );
  }
};

const componentToggles = {
  "top-panel": (isEnabled) => {
    try {
      [Main.panel, ...Main.mmPanel].forEach((mmpanel) => {
        toggleTransparency(mmpanel, isEnabled);
        if (mmpanel._leftCorner) {
          toggleTransparency(mmpanel._leftCorner, isEnabled);
        }
        if (mmpanel._rightCorner) {
          toggleTransparency(mmpanel._rightCorner, isEnabled);
        }
      });
    } catch (error) {
      log(error);
    }
  },
  dash: (isEnabled) =>
    toggleTransparency(Main.overview.dash._background, isEnabled),
  search: (isEnabled) =>
    toggleTransparency(Main.overview.searchEntry, isEnabled),
};

const onChange = (_, key) => {
  const isEnabled = settings.get_boolean(key);
  if (componentToggles[key]) {
    componentToggles[key](isEnabled);
  }
};

function enable() {
  Object.keys(settingskeys).forEach((key) => {
    if (settings.get_boolean(key)) {
      componentToggles[key](true);
    }
    settingskeys[key] = settings.connect("changed::" + key, onChange);
  });
}

function disable() {
  Object.keys(settingskeys).forEach((key) => {
    componentToggles[key](false);
    settings.disconnect(settingskeys[key]);
  });
}
