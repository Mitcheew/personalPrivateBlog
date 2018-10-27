import React, { Component } from 'react'
import Slider from 'react-slick'
import axios from 'axios';

class Album extends Component {
    constructor() {
        super()
        this.state = {
            photos: []
        }
    }

    componentDidMount() {
        axios.get(`/api/photos`)
        .then(response => {
            this.setState({
                photos: response.data
            })
        })
    }

    render() {
        let settings = {
            dots: true,
            accessibility: true,
            centerMode: true,
            lazyLoad: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            customPaging: (i) => {
                return (
                  <a>
                    <img style={{
                        maxHeight: "50px",
                        marginRight: "10px"
                    }}
                    src={this.state.photos[i].image} />
                  </a>
                );
              },

        };
        let photoReel = this.state.photos.map(photo => {
            return (
                <div key={photo.photo_id}>
                    <img style={{
                        maxHeight: "350px"
                    }}
                    src={photo.image} alt="" />
                </div>
            )
        })
        return (
                <Slider {...settings}>
                    {photoReel}
                </Slider>
        )
    }
}

export default Album