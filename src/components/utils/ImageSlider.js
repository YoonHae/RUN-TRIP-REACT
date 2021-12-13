import React from 'react'
import { Carousel } from 'antd';

function ImageSlider(props) {
    return (
        <div style={{overflow:"hidden"}}>

            <Carousel autoplay
            style={{display:"flex", width:"465px", height: "200px"}}>
                {props.images.map((image, index) => (

                    index !== -1 &&
                    <div key={index}>
                        <img style={{ width: '100%', height: '200px' }}
                            src={`${image}`} alt="productImage" />
                    </div>
                    
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider