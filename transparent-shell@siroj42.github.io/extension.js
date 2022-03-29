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

function enable() {
  Object.keys(settingskeys).forEach((key) => {
    if (settings.get_boolean(key)) {
      enable_fkt(key);
    }
    settingskeys[key] = settings.connect("changed::" + key, someChange);
  });
}

function disable() {
  Object.keys(settingskeys).forEach((key) => {
    disable_fkt(key);
    settings.disconnect(settingskeys[key]);
  });
}

function someChange(_, key) {
  if (settings.get_boolean(key)) {
    enable_fkt(key);
  } else {
    disable_fkt(key);
  }
}

function enable_fkt(key) {
  switch (key) {
    case "top-panel":
      Main.panel.add_style_class_name("shell-transparency");
      Main.panel._leftCorner.add_style_class_name("shell-transparency");
      Main.panel._rightCorner.add_style_class_name("shell-transparency");
      try {
        Main.mmPanel.forEach((mmpanel) => {
          mmpanel.add_style_class_name("shell-transparency");
          mmpanel._leftCorner.add_style_class_name("shell-transparency");
          mmpanel._rightCorner.add_style_class_name("shell-transparency");
        });
      } catch (error) {
        log(error);
      }
      break;
    case "dash":
      Main.overview.dash._background.add_style_class_name("shell-transparency");
      break;
    case "search":
      Main.overview.searchEntry.add_style_class_name("search-transparency");
      break;
    default:
      return;
  }
}

function disable_fkt(key) {
  switch (key) {
    case "top-panel":
      Main.panel.remove_style_class_name("shell-transparency");
      Main.panel._leftCorner.remove_style_class_name("shell-transparency");
      Main.panel._rightCorner.remove_style_class_name("shell-transparency");
      try {
        Main.mmPanel.forEach((mmpanel) => {
          mmpanel.remove_style_class_name("shell-transparency");
          mmpanel._leftCorner.remove_style_class_name("shell-transparency");
          mmpanel._rightCorner.remove_style_class_name("shell-transparency");
        });
      } catch (error) {
        log(error);
      }
      break;
    case "dash":
      Main.overview.dash._background.remove_style_class_name(
        "shell-transparency"
      );
      break;
    case "search":
      Main.overview.searchEntry.remove_style_class_name("search-transparency");
      break;
    default:
      return;
  }
}
