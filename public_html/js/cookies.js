function disableCookieOverlay() {
    hideOverlay("cookie-note");
    window.localStorage.setItem("cookies-accepted", "true");
}
function showCookieOverlay() {
    if (window.localStorage.getItem("cookies-accepted") == null) {
        showOverlay("cookie-note");
    }
}
