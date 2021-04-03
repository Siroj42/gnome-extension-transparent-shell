const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;

const Extension = ExtensionUtils.getCurrentExtension();

let gschema = Gio.SettingsSchemaSource.new_from_directory(
    Extension.dir.get_child('schemas').get_path(),
    Gio.SettingsSchemaSource.get_default(),
    false
);

let settings = new Gio.Settings({
    settings_schema: gschema.lookup('org.gnome.shell.extensions.transparent-shell', true)
});

let settingskeys = {
    "top-panel": 0,
    "dash": 0,
    "search": 0,
}


function init(){
    log("Starting transparent-shell extension");
}

function enable() {
    Object.keys(settingskeys).forEach(key => {
        if (settings.get_boolean(key)) {
            enable_fkt(key);
        }
        settingskeys[key] = settings.connect(
            'changed::'+key,
            someChange
        );
    });
}

function disable() {
    Object.keys(settingskeys).forEach(key => {
        disable_fkt(key);
        settings.disconnect(settingskeys[key]);
    });
}



function someChange(_,key){
    if(settings.get_boolean(key)){
        enable_fkt(key);
    }else{
        disable_fkt(key);
    }
}


function enable_fkt(key){
    switch (key) {
        case "top-panel":
            Main.panel.add_style_class_name('shell-transparency');
            Main.panel._leftCorner.add_style_class_name('shell-transparency');
            Main.panel._rightCorner.add_style_class_name('shell-transparency');
            try {
                Main.mmPanel.forEach(mmpanel => {
                    mmpanel.add_style_class_name('shell-transparency');
                    mmpanel._leftCorner.add_style_class_name('shell-transparency');
                    mmpanel._rightCorner.add_style_class_name('shell-transparency');
                });
            } catch (error) {
                log(error);
            }
            break;
        case "dash":
            Main.overview.dash._background.add_style_class_name('shell-transparency');
            break;
        case "search":
            Main.overview.searchEntry.add_style_class_name("search-transparency");
            break;
        default:
            return;
    }
}



function disable_fkt(key){
    switch (key) {
        case "top-panel":
            Main.panel.remove_style_class_name('shell-transparency');
            Main.panel._leftCorner.remove_style_class_name('shell-transparency');
            Main.panel._rightCorner.remove_style_class_name('shell-transparency');
            try {
                Main.mmPanel.forEach(mmpanel => {
                    mmpanel.remove_style_class_name('shell-transparency');
                    mmpanel._leftCorner.remove_style_class_name('shell-transparency');
                    mmpanel._rightCorner.remove_style_class_name('shell-transparency');
                });
            } catch (error) {
                log(error);
            }
            break;
        case "dash":
            Main.overview.dash._background.remove_style_class_name('shell-transparency');
            break;
        case "search":
            Main.overview.searchEntry.remove_style_class_name("search-transparency");
            break;
        default:
            return;
    }
}
