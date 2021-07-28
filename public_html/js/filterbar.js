function hideFilterBar() {
  var searchbar = document.getElementById("filterBar");
  searchbar.style.opacity = 0;
  searchbar.style.pointerEvents = "none";
}
function showFilterBar() {
  var searchbar = document.getElementById("filterBar");
  searchbar.style.opacity = 1;
  searchbar.style.pointerEvents = "all";
}
