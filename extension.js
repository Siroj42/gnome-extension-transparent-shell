const St = imports.gi.St;
const Main = imports.ui.main;
const workspaceBox = imports.ui.workspaceThumbnail.ThumbnailsBox;

function enable() {
    Main.panel.actor.remove_style_class_name('solid');
    Main.panel.actor.add_style_class_name('shell-transparency');

    Main.overview.dash._container.add_style_class_name('shell-transparency');
    
    Main.overview._overview._controls._thumbnailsBox.add_style_class_name('shell-transparency');
}

function disable() {
    Main.panel.actor.remove_style_class_name('shell-transparency');
    Main.panel.actor.add_style_class_name('solid');

    Main.overview.dash._container.remove_style_class_name('shell-transparency');
    
    Main.overview._overview._controls._thumbnailsBox.remove_style_class_name('shell-transparency');
}
