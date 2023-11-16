import Gtk from "gi://Gtk";

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export function init() {}

import { Box, Orientation } from 'ExtensionPreferences'; // Replace 'some-library' with the actual library you're using

export default class MyExtensionPreferences extends ExtensionPreferences {
  constructor(settings) {
    super(settings);

    const frame = this.createFrame();

    this.addBooleanSwitch(frame, "Transparent Top Panel", 'top-panel', settings);
    this.addBooleanSwitch(frame, "Transparent Dash", 'dash', settings);
    this.addBooleanSwitch(frame, "Transparent Search", 'search', settings);

    return frame;
  }

  createFrame() {
    return new Box({
      orientation: Orientation.VERTICAL,
      margin_top: 20,
      margin_bottom: 20,
      margin_start: 20,
      margin_end: 20,
      spacing: 20,
    });
  }

  addBooleanSwitch(frame, label, key, settings) {
    // Assuming you have a method to add boolean switches to the frame
    // Implement or replace with the actual method you are using
    // Example: frame.addBooleanSwitch(label, key, settings);
  }
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
