const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

function init() { }

function buildPrefsWidget() {
	this.settings = ExtensionUtils.getSettings();


	let frame = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		margin_top: 20,
		margin_bottom: 20,
		margin_start: 20,
		margin_end: 20,
		spacing: 20
	});

	addBooleanSwitch(frame, "Transparent Top Panel", 'top-panel');
	addBooleanSwitch(frame, "Transparent Dash", 'dash');
	addBooleanSwitch(frame, "Transparent Search", 'search');

	return frame;
}


function addBooleanSwitch(frame, labelText, key) {
	let gtkSwitch = new Gtk.Switch({hexpand: true, halign: Gtk.Align.END});
	gtkSwitch.set_active(this.settings.get_boolean(key));
	settings.bind(
		key,
		gtkSwitch,
		'active',
		Gio.SettingsBindFlags.DEFAULT
	);

	let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, spacing: 20});
	hbox.append(new Gtk.Label({label: labelText, use_markup: true}));
	hbox.append(gtkSwitch);
	frame.append(hbox);
}
