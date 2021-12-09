import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col } from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { addToCart } from '../../../_actions/user_actions';
import { continents } from '../LandingPage/Sections/Datas';
import { useDispatch } from 'react-redux';
import { HISTORY_SERVER } from '../../../components/Config';


function DetailProductPage(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})

    useEffect(() => {
        Axios.get(`/api/plans/${productId}`)
            .then(response => {
                if(response.data.success)
                {
                    let plan = response.data.plan;
                    plan.date = `${plan.date.substr(0, 4)}/${plan.date.substr(4, 2)}/${plan.date.substr(6, 2)}`;
                    plan.continent = continents[plan.continent-1].name;
                    setProduct(plan);
                } else {
                    alert(response.data.message);
                }
            })

    }, [])

    const addToCartHandler = () => {
        const params = {
            plan_id: productId,
        }

        Axios.post('/api/history', params)
            .then(response => {
                if (response.data.success) {
                    alert('my trip 에 추가하였습니다.')
                } else {
                    alert('my trip 에 추가하는데 오류가 발생하였습니다.')
                }
                
            });    
        }

    return (
        <div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                <Col lg={12} xs={24}>
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} xs={24}>
                    <ProductInfo
                        addToCart={addToCartHandler}
                        detail={Product} />
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage
