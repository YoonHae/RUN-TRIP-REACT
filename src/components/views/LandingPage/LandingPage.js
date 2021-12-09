import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { continents, price } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';
import moment from 'moment';
import logo from '../../../images/logo.jpg'

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()
    const [SearchTerms, setSearchTerms] = useState("")

    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getProducts(variables)

    }, [])

    const getProducts = (variables) => {
        Axios.get('/api/plans', variables)
            .then(response => {
                if (response.data.success) {
                    if (variables.loadMore) {
                        setProducts([...Products, ...response.data.plans])
                    } else {
                        setProducts(response.data.plans)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fectch product datas')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters,
            searchTerm: SearchTerms
        }
        getProducts(variables)
        setSkip(skip)
    }


    const renderCards = Products.map((product, index) => {
        let str_when = product.date ? `${product.date.substr(0, 4)}/${product.date.substr(4, 2)}/${product.date.substr(6, 2)}` : '언제든';
        let str_where = product.continent ? continents[product.continent-1].name : '어디든';

        return <Col lg={6} md={8} xs={24} key={`${product.id}`}>
            <Card
                hoverable={true}
                cover={<a href={`/product/${product.id}`} > <ImageSlider images={product.images} /></a>}
            >
                <Meta
                    title={product.title}
                    description={`${str_where} - ${str_when}`}
                />
            </Card>
        </Col>
    })


    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters

        }
        getProducts(variables)
        setSkip(0)

    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {

            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        console.log('array', array)
        return array
    }

    
    const onChangeDateRange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues

        }

        console.log(newFilters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }


    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <img src={logo} style={{width: '100%', height: '50%', marginBottom: '20px'}}/>
                <br />
                <h2>  Let's Run Anywhere  <Icon type="rocket" />  </h2>
                <br />
            </div>


            {/* Filter  */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    <CheckBox
                        list={continents}
                        handleFilters={filters => handleFilters(filters, "continents")}
                    />
                </Col>
                <Col lg={12} xs={24} >
                    {/* Search  */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>

                        <SearchFeature
                            refreshFunction={updateSearchTerms}
                        />

                    </div>
                </Col>
            </Row>

            <div style={{clear:'both', display:'block'}}></div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {Products.length === 0 ?
                        <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                            <h2>No post yet...</h2>
                        </div> :
                        <div>
                            <Row gutter={[16, 16]}>

                                {renderCards}

                            </Row>


                        </div>
                }
            </div>
            <br /><br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }


        </div>
    )
}

export default LandingPage
