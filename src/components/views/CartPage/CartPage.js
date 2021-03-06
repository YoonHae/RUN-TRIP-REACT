import React, { useEffect, useState } from 'react'
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty } from 'antd';
import Axios from 'axios';
import { HISTORY_SERVER } from '../../../components/Config';
import {continents} from '../LandingPage/Sections/Datas'

function CartPage(props) {
    const [PlanList, setPlanList] = useState([])

    useEffect(() => {
        Axios.get(HISTORY_SERVER)
            .then((response) => {
                if(response.data.success) {
                    let historyList = response.data.history;
                    for(var item of historyList){
                        if (item.date) item.date = item.date.substr(0, 4) + "/" + item.date.substr(4, 2) + "/" + item.date.substr(6, 2)
                        if (item.continent) item.continent = continents[item.continent-1].name;
                    }
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
