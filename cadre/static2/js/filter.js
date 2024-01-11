function setFilter(map) {
    const filter = document.getElementById('filter')
    console.log(filter)
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(filter);
}

export default setFilter