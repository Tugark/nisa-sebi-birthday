import type {Point} from "geojson";
import {type ILngLatLike, type LngLatLike, Map, Marker, Popup} from 'maplibre-gl';
import {randomPoint} from "@turf/random";

type Rating = {
    text: string;
    author: string;
}
type Location = {
    title: string;
    description: string;
    ratingNegative?: Rating;
    ratingPositive?: Rating;
    location: Point;
    image: string;
    attribution: string;
    details: string;
    earlyBookingAdvised?: boolean;
};

const NZ_CENTER: ILngLatLike = [172.463, -41.2]
const INITIAL_ZOOM = 5

const initMap = () => {
    const map = new Map({
        container: 'map', // container id
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: NZ_CENTER,
        zoom: INITIAL_ZOOM,
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

            const specialMarker = createSpecialMarkerForTheLord()
            specialMarker.addTo(map);
            handleMarkerRedirect(specialMarker);
        });
    });

    const backToStart = document.getElementById('backToStart');
    if (backToStart) {
        backToStart.addEventListener('click', (e) => {
            e.preventDefault();
            map.flyTo({center: NZ_CENTER, zoom: INITIAL_ZOOM});
        })
    }
}

const createSpecialMarkerForTheLord: () => Marker = () => {
    const randomLocation = randomPoint(1, {
        bbox: [
            174.98364303454753,
            -39.84666316476821,
            176.8434332294279,
            -38.09410871256688
        ]
    })

    return new Marker().setLngLat(randomLocation.features[0].geometry.coordinates as [number, number]).setRotation(15)
}

const handleMarkerRedirect = (marker: Marker) => {
    const markerElement = marker
    markerElement.getElement().addEventListener('click', () => {
        window.location.href = 'surprise.html'
    })


    const originalPosition = markerElement.getLngLat()
    setInterval(() => {
        marker.setLngLat(moveMarkerRandomly(originalPosition.lat, originalPosition.lng))
    }, 7500);
}

function moveMarkerRandomly(
    lat: number,
    lng: number
): LngLatLike {
    const randomNorthKm = Math.random() * 2 - 1;
    const randomEastKm = Math.random() * 2 - 1;
    const earthKmPerDegreeLat = 111;
    const deltaLat = randomNorthKm / earthKmPerDegreeLat;

    const latRad = (lat * Math.PI) / 180;
    const deltaLng = randomEastKm / (earthKmPerDegreeLat * Math.cos(latRad));

    const newLat = lat + deltaLat;
    const newLng = lng + deltaLng;

    return [newLng, newLat];
}

const generatePopupForLocation: (item: Location) => Popup = (item: Location) => {
    return new Popup({anchor: 'top-right', focusAfterOpen: false, closeButton: false, className: "popup"}).setHTML(`
        <img src="${item.image}" alt="${item.title}" class="img-fluid rounded mx-auto d-block mb-1" style="max-height: 300px;"/>
        ${item.attribution ? getAttributionBlock(item.attribution) : '<div class="mb-4"></div>'}
        <h3 class="display-6">${item.title}</h3>
        ${item.earlyBookingAdvised ? '<p class="text-warning-emphasis"><i class="bi bi-exclamation-circle"></i>&nbsp;Early booking adviced!</p>' : ''}
        <p class="lead">${item.description}</p>
        <hr>
        ${item.ratingPositive && item.ratingNegative ? getRatingBlock(item.ratingPositive, item.ratingNegative) : ''}
        
        <a class="btn btn-primary d-block" href="${item.details}" role="button" target="_blank" rel="noopener nofollow noreferrer">Details</a>
    `)
}

const getRatingBlock = (ratingPositive: Rating, ratingNegative: Rating) => {
    return `
    <h4>What Google Reviewers say</h4>
        <figure>
          <blockquote class="blockquote fs-6">
            <p>${ratingPositive.text}</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            ★★★★★ by ${ratingPositive.author}
          </figcaption>
        </figure>
        <figure>
          <blockquote class="blockquote fs-6">
            <p>${ratingNegative.text}</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            ★☆☆☆☆ by ${ratingNegative.author}
          </figcaption>
        </figure>
    `
}

const getAttributionBlock = (attribution: string) => {
    return ` <p class="mb-4">
          <small>Image by ${attribution}</small>
        </p>`
}

export default initMap;