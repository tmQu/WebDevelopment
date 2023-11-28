function setFilter(map) {
    const filter = document.getElementById('Filter')
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(filter);
}

export default setFilter