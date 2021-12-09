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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger"
                    onClick={addToCarthandler}
                >
                    함께해요
                    </Button>
            </div>
        </div>
    )
}

export default ProductInfo
