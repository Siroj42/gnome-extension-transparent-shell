import { getSettings, bind } from 'utils';
import { Gtk, Gio, ExtensionUtils } from 'imports';

export function init() {}

export function buildPrefsWidget() {
  const settings = getSettings();

  let frame = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    margin_top: 20,
    margin_bottom: 20,
    margin_start: 20,
    margin_end: 20,
    spacing: 20,
  });

  addBooleanSwitch(frame, "Transparent Top Panel", 'top-panel', settings);
  addBooleanSwitch(frame, "Transparent Dash", 'dash', settings);
  addBooleanSwitch(frame, "Transparent Search", 'search', settings);

  return frame;
}

export function addBooleanSwitch(frame, labelText, key, settings) {
  let gtkSwitch = new Gtk.Switch({ hexpand: true, halign: Gtk.Align.END });
  gtkSwitch.set_active(settings.get_boolean(key));
  bind(key, settings, gtkSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

  let hbox = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,
    spacing: 20,
  });
  hbox.append(new Gtk.Label({ label: labelText, use_markup: true }));
  hbox.append(gtkSwitch);
  frame.append(hbox);
}
