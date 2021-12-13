import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd';

function ProductInfo(props) {

    const [Product, setProduct] = useState({})

    useEffect(() => {

        setProduct(props.detail)

    }, [props.detail])

    const addToCarthandler = () => {
        props.addToCart(props.detail._id)
    }


    return (
        <div>
            <Descriptions title="Information">
                <Descriptions.Item label="언제"> {Product.date}</Descriptions.Item>
                <Descriptions.Item label="어디에서">{Product.continent}</Descriptions.Item>
            </Descriptions>

            <br />
            <p>{Product.description}</p>

            <br />
            <br />
            <br />
            
                
            
        </div>
    )
}

export default ProductInfo
