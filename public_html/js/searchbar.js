function hideSearch() {
    var searchbar = document.getElementById("searchBar");
    searchbar.style.opacity = 0;
    searchbar.style.pointerEvents = "none";
}
function showSearch() {
    var searchbar = document.getElementById("searchBar");
    searchbar.style.opacity = 1;
    searchbar.style.pointerEvents = "all";
}
function clearSearchBar() {
    document.getElementById("search").value = "";
}
