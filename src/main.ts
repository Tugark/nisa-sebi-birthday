import './style.css'
import {Map, Marker, Popup} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type {Point} from "geojson";

type Rating = {
    text: string;
    author: string;
}
type Location = {
    title: string;
    description: string;
    ratingNegative: Rating;
    ratingPositive: Rating;
    location: Point;
    image: string;
    details: string;
    earlyBookingAdvised?: boolean;
};

const map = new Map({
    container: 'map', // container id
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [172.463, -41.2],
    zoom: 5,
    maxBounds: [
        [156.0, -57.5], // southwest coordinates (lng, lat)
        [189.0, -14.0]  // northeast coordinates (lng, lat)
    ]
});


map.on('load', async () => {
    await fetch('./data.json').then(async res => {
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
    return new Popup({offset: 25, focusAfterOpen: false, closeButton: false, className: "popup"}).setHTML(`
        <img src="${item.image}&t=${Math.random()}" alt="${item.title}" class="img-fluid rounded mx-auto d-block mb-4" style="max-height: 300px;"/>
        <h3 class="display-6">${item.title}</h3>
        ${item.earlyBookingAdvised ? '<p class="text-warning-emphasis"><i class="bi bi-exclamation-circle"></i>&nbsp;Early booking adviced!</p>' : ''}
        <p class="lead">${item.description}</p>
        <hr>
        <h4>What Google Reviewers say</h4>
        <figure>
          <blockquote class="blockquote fs-6">
            <p>${item.ratingPositive.text}</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            ★★★★★ by ${item.ratingPositive.author}
          </figcaption>
        </figure>
        <figure>
          <blockquote class="blockquote fs-6">
            <p>${item.ratingNegative.text}</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            ★☆☆☆☆ by ${item.ratingNegative.author}
          </figcaption>
        </figure>
        <a class="btn btn-primary d-block" href="${item.details}" role="button" target="_blank" rel="noopener nofollow noreferrer">Details</a>
    `)
}