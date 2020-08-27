const St = imports.gi.St;
const Main = imports.ui.main;

function enable() {
    Main.panel.actor.remove_style_class_name('solid');
    Main.panel.actor.add_style_class_name('shell-transparency');

    Main.overview.dash.actor.remove_style_class_name('solid');
    Main.overview.dash.actor.add_style_class_name('shell-transparency');
}

function disable() {
    Main.panel.actor.remove_style_class_name('shell-transparency');
    Main.panel.actor.add_style_class_name('solid');

    Main.overview.dash.actor.remove_style_class_name('shell-transparency');
    Main.overview.dash.actor.add_style_class_name('solid');
}
