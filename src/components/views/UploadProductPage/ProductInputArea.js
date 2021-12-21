import React, { useState } from 'react'
import { Input, DatePicker } from 'antd';
//import FileUpload from '../../utils/FileUpload'
//import Axios from 'axios';
import moment from 'moment';
//import { useSelector, useDispatch } from 'react-redux';
import { Continents } from './UploadProductPage'
//import useAsync from '../../../hoc/useAsync';


//const { Title } = Typography;
const { TextArea } = Input;



function ProductInputArea(props) {
    let Product = props.product;
    
    const [TitleValue, setTitleValue] = useState(Product.title)
    const [DescriptionValue, setDescriptionValue] = useState(Product.description)
    const [DateValue, setDateValue] = useState(Product.date)
    const [ContinentValue, setContinentValue] = useState(Product.continent)

    let MomentValue = Product.date ? moment(Product.date, 'YYYY/MM/DD') : null;

    
    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const onDateChange = (date, dateString) => {
        setDateValue(dateString.replace('/', '').replace('/', ''));
        MomentValue = date;
    }

    const onContinentsSelectChange = (event) => {
        setContinentValue(event.currentTarget.value)
    }

    props.getProductCallback(() => {
        Product.title = TitleValue;
        Product.description = DescriptionValue;
        Product.date = DateValue.replace('/', '').replace('/', '');
        Product.continent = ContinentValue ? ContinentValue : 1;
        return Product;
    });

    return (
            <div>
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={DescriptionValue}
                />
                <br />
                <br />
                <label>When</label> <br />
                {console.log(MomentValue)}
                <DatePicker onChange={onDateChange}
                                defaultValue={MomentValue} format='YYYY/MM/DD'/>                
                
                <br /><br />
                <label>Where</label><br />
                <select onChange={onContinentsSelectChange} value={ContinentValue}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value} </option>
                    ))}
                </select>

            </div>
    )
}



export default ProductInputArea
