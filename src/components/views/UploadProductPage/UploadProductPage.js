import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon, DatePicker } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';
import ProductInputArea from './ProductInputArea';

const { Title } = Typography;
const { TextArea } = Input;

export const Continents = [
    { key: 1, value: "서울" },
    { key: 2, value: "부산" },
    { key: 3, value: "대구" },
    { key: 4, value: "인천" },
    { key: 5, value: "광주" },
    { key: 6, value: "울산" },
    { key: 7, value: "세종시" },
    { key: 8, value: "경기도" },
    { key: 9, value: "강원도" },
    { key: 10, value: "충청북도" },
    { key: 11, value: "전라북도" },
    { key: 12, value: "전라남도" },
    { key: 13, value: "경상북도" },
    { key: 14, value: "경상남도" },
    { key: 15, value: "제주도" },
]

function UploadProductPage(props) {

    let Product = {};
    let Images = [];
    
    let ProductCallback = null;
    const getProduct = (cb) => {
        ProductCallback =  cb;
    }

    const updateImages = (newImages) => {
        Images = newImages;
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        Product = ProductCallback();

        console.log(Product);
        console.log(Images);
        if (!Product.title || !Product.description || !Product.date ||
            !Product.continent || !Images) {
            return alert('누락된 정보가 있습니다. 모두 기입해주세요.')
        }

        Product.images = [];
        let productId = null;
        // 먼저 데이터는 insert 하고...
        let response = await Axios.post('/api/plans', Product);
        if (response.data.success) {
            // pk 받아서 해당 정보를 s3 meta data 에 추가
            productId = response.data.id;
                        
            let imageUrlList = [];
            const config = { header: { 'content-type': 'multipart/form-data' },
                            transformRequest: [function (data, headers) {
                                delete headers.common['Authorization'];
                                return data;
                            }] };

            for (var image of Images) {
                // get S3 upload url
                var imageInfo = {name: image.name, type: image.type, size: image.size, runtrip_id: productId};
                let response = await Axios.get('/api/aws/s3/securekey', {params: imageInfo});
                if( response.data.success)  {
                    const url = response.data.url;
                    console.log('issue s3 url')
                    // upload image to S3
                    response = await Axios.put(url, image, config);
                    if(response.status === 200)
                    {
                        console.log('upload s3')
                        const imageUrl = url.split('?')[0];
                        imageUrlList.push(imageUrl);
                    }
                } 
            }
            
            let message = '등록이 완료되었습니다.';
            // S3 업로드 후에 다시 update 
            Axios.put(`/api/plans/${productId}` , {images: imageUrlList})
                .then(response => {
                    if (!response.data.success) {
                        message = '이미지 정보없이 저장되었습니다.';
                    }

                    alert(message);
                    props.history.push('/product/'+productId);
                })            
            
        } else {
            alert('등록중 문제가 발생하였습니다.')
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>어떻게 달려볼까요?</Title>
            </div>


            <Form onSubmit={onSubmit} >

                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} uploadedImages={Images} />

                <br />
                <br />
                <ProductInputArea product={Product} getProductCallback={getProduct}></ProductInputArea>
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    생성하기
                </Button>

            </Form>

        </div>
    )
}

export default UploadProductPage
