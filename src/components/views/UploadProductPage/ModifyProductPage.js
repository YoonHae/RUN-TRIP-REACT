import React from 'react'
import { Typography, Button, Form } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import useAsync from '../../../hoc/useAsync';
import FileUpload from '../../utils/FileUpload';
import ProductInputArea from './ProductInputArea';


const { Title } = Typography;

async function getProductAsync(productId) {
    console.log('getProductAsync');
    let response = await Axios.get(`/api/plans/${productId}`);
    return response.data;
}


function ModifyProductPage(props) {
    const productId = props.match.params.productId;
    const user = useSelector(state => state.user);
    
    const [state, refetch] = useAsync(getProductAsync, [productId], []);
    const {loading, data: ProductData, error} = state;

    
    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!ProductData) return null;

    let Product = ProductData.plan;

    
    

    let Images = Product?Product.images:[];
    let befImages = [...Images];

    console.log('user ', user);
    console.log('Product ', Product);
    if (!(user && user.userData && Product && user.userData.id === Product.user_id)) {
        alert('기본 데이터 조회중 문제가 발생하였습니다.')
        props.history.push('/');
        return (<div></div>);
    }

    Product.date = `${Product.date.substr(0, 4)}/${Product.date.substr(4, 2)}/${Product.date.substr(6, 2)}`;
    
    let ProductCallback = null;
    const getProduct = (cb) => {
        ProductCallback =  cb;
    }

    const updateImages = (newImages) => {
        //setImages(newImages)
        Images = newImages;
    }

    const checkImages = () => {
        return Images && Images.length > 0;
    }

    const updateInputArea = (newProduct) => {
        Product = newProduct;
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
               
        let deleteUrls = befImages.filter(value => !Images.includes(value));
        if (deleteUrls.length > 0) {
            let deleteResponse = await deleteS3(deleteUrls);
            console.log(deleteResponse);
        }
        imageUrlList = []
        
        for (var image of Images) {
            if (typeof image === "string") {
                imageUrlList.push(image);
            } 
            else {
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
                    else 
                    {
                        console.log('Fail Put S3 image');
                        alert('이미지를 저장하는중 문제가 발생하였습니다. 나머지 정보만 수정을 진행합니다.');
                        break;
                    }
                } else {
                    console.log('Fail Get S3 URL');
                    alert('이미지를 저장하는중 문제가 발생하였습니다. 나머지 정보만 수정을 진행합니다.');
                    break;
                }
                
            }
        }

        Product.images = imageUrlList;
        
        Axios.put('/api/plans/' + productId, Product)
            .then(response => {
                if (response.data.success) {
                    alert('수정되었습니다.')
                    props.history.push('/product/'+productId)
                } else {
                    alert('수정중 문제가 발생하였습니다.')
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
                {console.log('render', Images)}
                <FileUpload refreshFunction={updateImages} uploadedImages={Images} />

                <br />
                <br />
                <ProductInputArea product={Product} getProductCallback={getProduct}></ProductInputArea>
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    수정완료
                </Button>

            </Form>

        </div>
    )
            
}




export default ModifyProductPage
