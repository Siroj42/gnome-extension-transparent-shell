const St = imports.gi.St;
const Main = imports.ui.main;
const workspaceBox = imports.ui.workspaceThumbnail.ThumbnailsBox;

function enable() {
    Main.panel.actor.add_style_class_name('shell-transparency');
    Main.panel._leftCorner.add_style_class_name('shell-transparency');
    Main.panel._rightCorner.add_style_class_name('shell-transparency');

    Main.overview.dash._container.add_style_class_name('shell-transparency');

    try {
        Main.mmPanel.forEach(function (mmpanel) {
	    mmpanel.add_style_class_name('shell-transparency');
	    mmpanel._leftCorner.add_style_class_name('shell-transparency');
	    mmpanel._rightCorner.add_style_class_name('shell-transparency');
	});
    } catch (error) {
        return;
    }
}

function disable() {
    Main.panel.actor.remove_style_class_name('shell-transparency');
    Main.panel._leftCorner.remove_style_class_name('shell-transparency');
    Main.panel._rightCorner.remove_style_class_name('shell-transparency');

    Main.overview.dash._container.remove_style_class_name('shell-transparency');
    
    try {
        Main.mmPanel.forEach(function (mmpanel) {
            mmpanel.remove_style_class_name('shell-transparency');
            mmpanel._leftCorner.remove_style_class_name('shell-transparency');
            mmpanel._rightCorner.remove_style_class_name('shell-transparency');
        });
    } catch (error) {
        return;
    }
}
