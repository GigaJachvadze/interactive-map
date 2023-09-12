import json from '../data/custom.geo.json'
import { ICountry, IVector2 } from './types';

export class Map {
    private countries: ICountry[] = []

    canvas: HTMLCanvasElement;
    width: number;
    height: number;

    ctx: CanvasRenderingContext2D | null = null;

    zoom = 1;
    sensitivity = 1;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.init();
    }

    init(): void {
        this.fillData();
        this.initCanvas();

        console.log(this.countries);
    }

    fillData(): void {
        let countriesData = json.features;
        for (let i = 0; i < countriesData.length; i++) {
            let country = <ICountry>{name: countriesData[i].properties.name, islands: []}

            let countryData = countriesData[i].geometry;

            if (countryData.type == "Polygon") {
                for (let j = 0; j < countryData.coordinates.length; j++) {
                    let island = countryData.coordinates[j];
                    let islandObj = [];
                    for (let k = 0; k < island.length; k++) {
                        const item = island[k];
                        let vector2 = <IVector2>{x: item[0], y: item[1]};
                        islandObj.push(vector2);
                    }
                    country.islands.push(islandObj);
                }
                this.countries.push(country);
            } else {
                for (let j = 0; j < countryData.coordinates.length; j++) {
                    let island = countryData.coordinates[j][0];
                    let islandObj = [];
                    for (let k = 0; k < island.length; k++) {
                        const item = island[k];
                        let vector2 = <IVector2>{x: item[0], y: item[1]};
                        islandObj.push(vector2);
                    }
                    country.islands.push(islandObj);
                }
                this.countries.push(country);
            }
        }
    }

    initCanvas(): void {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext('2d');
    }

    moveMapBy(x: number, y: number): void {
        for (let i = 0; i < this.countries.length; i++) {
            const country = this.countries[i];
            for (let j = 0; j < country.islands.length; j++) {
                const island = country.islands[j];
                for (let k = 0; k < island.length; k++) {
                    if (island[k].x > this.width) {
                        continue;
                    }
                    if (island[k].y > this.height) {
                        continue;
                    }
                    island[k].x -= x / (this.sensitivity * this.zoom);
                    island[k].y += y / (this.sensitivity * this.zoom);

                }
            }
        }

        this.draw();
    }

    zoomBy(zoom: number): void {
        if (zoom > 0) {
            this.zoom *= (zoom);
        } else {
            this.zoom /= (-zoom);
        }

        if (this.zoom == 0) {
            this.zoom = 1;
        }

        this.draw();
    }

    draw(): void {
        this.ctx?.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.countries.length; i++) {
            const country = this.countries[i];
            for (let j = 0; j < country.islands.length; j++) {
                const island = country.islands[j];
                this.ctx?.beginPath();
                for (let k = 0; k < island.length; k++) {
                    let x = (this.width / 2) + (island[k].x * (this.zoom / this.sensitivity));
                    let y = (this.height / 2) - (island[k].y * (this.zoom / this.sensitivity));

                    if (x > this.width && y > this.height) continue;
                    if (x < 0 && y < 0) continue;

                    if (k == 0) {
                        this.ctx?.moveTo(x, y);
                    } else {
                        this.ctx?.lineTo(x, y);
                    }
                }
                this.ctx?.stroke();
            }
        }
    }
}