import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {
    getCartItems,
    removeCartItem
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty } from 'antd';
import Axios from 'axios';
import Paypal from '../../utils/Paypal';
import { HISTORY_SERVER } from '../../../components/Config';

function CartPage(props) {
    const dispatch = useDispatch();
    const [ShowSuccess, setShowSuccess] = useState(false)
    const [PlanList, setPlanList] = useState([])

    useEffect(() => {
        Axios.get(HISTORY_SERVER)
            .then((response) => {
                if(response.data.success) {
                    setPlanList(response.data.history);
                }
            })

    }, [])


    const removeFromCart = (cart_id) => {
        Axios.delete(`${HISTORY_SERVER}/${cart_id}`)
            .then((response) => {
                if (response.data.success)
                {
                    setPlanList(PlanList.filter((item) => item.id !== cart_id));
                }
            });
                
    }

    


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            <div>

                <UserCardBlock
                    products={PlanList}
                    removeItem={removeFromCart}
                />

            </div>




        </div>
    )
}

export default CartPage
