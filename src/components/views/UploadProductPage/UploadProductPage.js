import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon, DatePicker } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';
import ProductInputArea from './ProductInputArea';

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
        if (!Product.title || !Product.description || !Product.date ||
            !Product.continent || !Images) {
            return alert('누락된 정보가 있습니다. 모두 기입해주세요.')
        }

        let imageUrlList = [];
        const config = { header: { 'content-type': 'multipart/form-data' } };

        // 올리던중 오류나면 기존에 올린 데이터 제거
        let deleteS3 = async (urlList) => {
            console.log(urlList);
            return await Axios.delete('/api/aws/s3', {data: {deleteUrls: urlList}});
        }
        
        for (var image of Images) {
            // get S3 upload url
            let response = await Axios.get('/api/aws/s3/securekey');
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
                else 
                {
                    console.log('Fail Put S3 image');
                    await deleteS3(imageUrlList);
                    alert('이미지를 저장하는중 문제가 발생하였습니다.');
                    return;
                }
            } else {
                console.log('Fail Get S3 URL');
                await deleteS3(imageUrlList);
                alert('이미지를 저장하는중 문제가 발생하였습니다.');
                
                //delete s3 files
                return;
            }
            
        }

        Product.images = imageUrlList;
        
        Axios.post('/api/plans', Product)
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
