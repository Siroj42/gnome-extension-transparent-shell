const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

function init() { }

function buildPrefsWidget() {
	let gschema = Gio.SettingsSchemaSource.new_from_directory(
		Extension.dir.get_child('schemas').get_path(),
		Gio.SettingsSchemaSource.get_default(),
		false
	);

	this.settings = new Gio.Settings({
		settings_schema: gschema.lookup('org.gnome.shell.extensions.transparent-shell', true)
	});


	let frame = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		border_width: 20,
		spacing: 20
	});

	addBooleanSwitch(frame, "Transparent Top Panel", 'top-panel');
	addBooleanSwitch(frame, "Transparent Dash", 'dash');
	addBooleanSwitch(frame, "Transparent Workspaces Overview", 'workspaces');

    frame.show_all();
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
	hbox.add(new Gtk.Label({label: labelText, use_markup: true}));
	hbox.add(gtkSwitch);
	frame.add(hbox);
}