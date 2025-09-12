import './style.css'
import {Map, Marker, Popup} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type {Point} from "geojson";

type Location = {
    title: string;
    description: string;
    ratingNegative: string;
    ratingPositive: string;
    location: Point;
};

const map = new Map({
    container: 'map', // container id
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [172.463, -41.2],
    zoom: 6
});


map.on('load', async () => {
    await fetch('/data.json').then(async res => {
        const data: Location[] = await res.json();
        data.forEach((item) => {
            new Marker()
                .setLngLat([item.location.coordinates[0], item.location.coordinates[1]])
                .setPopup(generatePopupForLocation(item))
                .addTo(map);
        });
    });
});

function generatePopupForLocation(item: Location): Popup {
    return new Popup({offset: 25}).setHTML(`
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p>Positive reviews: ${item.ratingPositive}</p>
        <p>Negative reviews: ${item.ratingNegative}</p>
    `)
}