import React, { Component } from 'react'
import jsonData from './slides.json'
import CarouselSlider from 'react-carousel-slider'

export default class Carousel extends Component {
    render() {

        let manner = {
            autoSliding: { interval: "4s" },
            duration: "1.5s"
        };

        let accEleSetting;

        let mobileRegx = /Mobi|Tablet|iPad|iPhone/;
        if (mobileRegx.test(navigator.userAgent)) {
            accEleSetting.button = false;
        }

        let buttonSetting = {
            placeOn: "middle-inside",
            hoverEvent: true,
            style: {
                left: {
                    height: "50px",
                    width: "50px",
                    color: "white",
                    background: "#3d3837",
                    borderRadius: "50%"
                },
                right: {
                    height: "50px",
                    width: "50px",
                    color: "white",
                    background: "#3d3837",
                    opacity: .9,
                    borderRadius: "50%"
                }
            }
        };

        return <CarouselSlider slideItems={jsonData.autoSliding.items}
            manner={manner}
            buttonSetting={buttonSetting} />;

    }
}
