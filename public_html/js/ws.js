const socket = new WebSocket(
    "ws://" + location.hostname + ":{rawCodeLabel<ws_config.port>}"
);
console.log("{rawCodeLabel<publicSessionID>}");

function showErrorOverlay(msg) {
    document.getElementById("errormessage").innerHTML = msg;
    document.getElementById("erroroverlay").style.display = "flex";
}

socket.onmessage = ({ data }) => {
    const verification_failed = /Verification failed/;
    if (data.match(verification_failed)) {
        showErrorOverlay(
            "Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut oder <a href='/logout'>melden</a> Sie sich ab und wieder an."
        );
        return;
    }
};
socket.onopen = () => {
    socket.send("INITIALIZE_WITH_SESSION_ID={rawCodeLabel<publicSessionID>}");
    function getCategories() {}
};
