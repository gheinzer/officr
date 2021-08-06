function showOverlay(id) {
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.pointerEvents = "all";
}
function hideOverlay(id) {
    document.getElementById(id).style.opacity = 0;
    document.getElementById(id).style.pointerEvents = "none";
}
