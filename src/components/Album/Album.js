import React, { Component } from 'react'
import Slider from 'react-slick'
import axios from 'axios';
import Header from '../Nav/Header'

class Album extends Component {
    constructor() {
        super()
        this.state = {
            photos: [],
            // nav1: null,
            // nav2: null
        }
        this.nav1 = React.createRef()
        this.nav2 = React.createRef()

    }

    componentDidMount() {
        // this.setState({
        //     nav1: this.slider1,
        //     nav2: this.slider2
        // })
        axios.get(`/api/photos`)
            .then(response => {
                this.setState({
                    photos: response.data
                })
            })
    }

    render() {
        let settings = {
            dots: false,
            lazyLoad: true,
            infinite: true,
            speed: 100,
            slidesToShow: 1,
            slidesToScroll: 1

        };
        let photoReel = this.state.photos.map(photo => {
            return (
                <div className='center-slide' key={photo.photo_id}>
                    <img className='post-preview' src={photo.image} alt="" />
                </div>
            )
        })
        return (
            <div className='desktop-body'>
                <Header />
                <h1 className='header'>Photo Album</h1>
                {/* {this.state.photos.length !== 0 ?
                <div> */}
                <Slider
                    asNavFor={this.nav2.current}
                    ref={this.nav1}
                    {...settings}
                >
                    {photoReel}
                </Slider>
                <Slider
                    asNavFor={this.nav1.current}
                    ref={this.nav2}
                    className='SliderPhotos'
                    dots={false}
                    lazyLoad={true}
                    infinite={true}
                    speed={100}
                    slidesToScroll={1}
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
                {/* </div>
            :
                    <h1>Loading...</h1>
                }*/}


            </div>
        )
    }
}

export default Album