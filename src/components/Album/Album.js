import React, { Component } from 'react'
import Slider from 'react-slick'
import axios from 'axios';

class Album extends Component {
    constructor() {
        super()
        this.state = {
            photos: [],
            nav1: null,
            nav2: null
        }
    }

    componentDidMount() {
        axios.get(`/api/photos`)
            .then(response => {
                this.setState({
                    photos: response.data
                })
            })
            this.setState({
                nav1: this.slider1,
                nav2: this.slider2
            })
    }

    render() {
        let settings = {
            dots: false,
            lazyLoad: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1

        };
        let photoReel = this.state.photos.map(photo => {
            return (
                <div key={photo.photo_id}>
                    <div className='center-slide'>
                        <img src={photo.image} alt="" />
                    </div>
                </div>
            )
        })
        return (
            <div>
                <h1>Photo Album</h1>
                <Slider
                    asNavFor={this.state.nav2}
                    ref={slider => (this.slider1 = slider)}
                    {...settings}
                >
                    {photoReel}
                </Slider>
                <Slider
                    className='SliderPhotos'
                    asNavFor={this.state.nav1}
                    ref={slider => (this.slider2 = slider)}
                    slidesToShow={photoReel.length < 5 ?
                        photoReel.length
                        :
                        5
                    }
                    swipeToSlide={true}
                    focusOnSelect={true}
                >
                    {photoReel}
                </Slider>

            </div>
        )
    }
}

export default Album