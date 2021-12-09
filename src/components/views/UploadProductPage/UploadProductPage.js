import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon, DatePicker } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

export const Continents = [
    { key: 1, value: "서울특별시" },
    { key: 2, value: "부산광역시" },
    { key: 3, value: "대구광역시" },
    { key: 4, value: "인천광역시" },
    { key: 5, value: "광주광역시" },
    { key: 6, value: "울산광역시" },
    { key: 7, value: "세종특별자치시" },
    { key: 8, value: "경기도" },
    { key: 9, value: "강원도" },
    { key: 10, value: "충청북도" },
    { key: 11, value: "전라북도" },
    { key: 12, value: "전라남도" },
    { key: 13, value: "경상북도" },
    { key: 14, value: "경상남도" },
    { key: 15, value: "제주특별자치도" },
]

function UploadProductPage(props) {

    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [DateValue, setDateValue] = useState(null)
    const [ContinentValue, setContinentValue] = useState(1)

    const [Images, setImages] = useState([])


    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const onDateChange = (date, dateString) => {
        setDateValue(dateString.replace('/', '').replace('/', ''));
    }

    const onContinentsSelectChange = (event) => {
        setContinentValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }
    const onSubmit = (event) => {
        event.preventDefault();


        if (!TitleValue || !DescriptionValue || !DateValue ||
            !ContinentValue || !Images) {
            return alert('누락된 정보가 있습니다. 모두 기입해주세요.')
        }

        const variables = {
            title: TitleValue,
            description: DescriptionValue,
            date: DateValue,
            images: Images,
            continent: ContinentValue,
        }

        Axios.post('/api/plans', variables)
            .then(response => {
                if (response.data.success) {
                    alert('등록이 완료되었습니다.')
                    props.history.push('/')
                } else {
                    alert('등록중 문제가 발생하였습니다.')
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>어떻게 달려볼까요?</Title>
            </div>


            <Form onSubmit={onSubmit} >

                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} />

                <br />
                <br />
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
                <DatePicker onChange={onDateChange}
                                defaultValue={null} format='YYYY/MM/DD'/>
                
                
                <br /><br />
                <label>Where</label><br />
                <select onChange={onContinentsSelectChange} value={ContinentValue}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value} </option>
                    ))}
                </select>
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default UploadProductPage
