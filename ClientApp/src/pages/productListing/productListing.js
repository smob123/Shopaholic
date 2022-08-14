import React, { useEffect, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { Container, Row, Col, Form } from 'react-bootstrap';

import queryString from 'query-string';

import ProductsModel from './productsModel';

import Header from '../../components/header/heaader';
import ProductCard from '../../components/productCard/productCard';

import Loading from '../../components/loading/loading';

export default function ProductListing(props) {

    const location = useLocation();
    const { search } = location;

    // list of products
    const [products, setProducts] = useState([]);
    // applied brand filter
    const [brandFilter, setBrandFilter] = useState(null);
    // applied category filter
    const [categoryFilter, setCategoryFilter] = useState(null);

    useMemo(async () => {
        // fetch products from the network
        const res = await ProductsModel.fetchProducts();
        if (res) {
            setProducts(res);
        }
    }, []);

    useEffect(() => {
        // set the brand and category filters evry time the search params change
        const params = queryString.parse(search);
        setBrandFilter(params.brand);
        setCategoryFilter(params.category);
    }, [search]);

    /**
     * returns the list filters as dropdown options
     */
    const getFilterLinks = (linkNames) => {
        const links = [];

        for (const name of linkNames) {
            links.push(
                <option key={`${Date.now()}_${name}_search_filter`}>
                    {name}
                </option>
            );
        }

        return links;
    }

    /**
     * returns brands as a dropdown list
     */
    const getBrands = () => {
        const brandNames = ['Nike', 'Adidas', 'Jordan', 'Under Armour'];
        return getFilterLinks(brandNames);
    }

    /**
     * returns categories as a dropdown list
     */
    const getCategories = () => {
        const categories = ['Men', 'Women', 'Kids'];
        return getFilterLinks(categories);
    }

    /**
     * applies filters to the products and returns the end result
     */
    const getFilteredProducts = () => {
        const params = queryString.parse(search);
        let res = [...products];

        if (params.category) {
            res = res.filter(p => p.category.toUpperCase() === params.category.toUpperCase());
        }

        if (params.brand) {
            res = res.filter(p => p.brand.toUpperCase() === params.brand.toUpperCase());
        }

        return res;
    }

    /**
     * returns rows of 4 product cards.
     */
    const getProducts = () => {
        const rows = [];

        const filteredProducts = getFilteredProducts();

        for (let i = 0; i < filteredProducts.length; i += 4) {
            rows.push(
                <Row
                    xs={1} sm={2} md={4}
                    key={`${Date.now()}_products_row_${i}`}>

                    <Col className='mb-5 px-3'>
                        <ProductCard
                            id={filteredProducts[i].id}
                            image={filteredProducts[i].images[0].url}
                            title={filteredProducts[i].title}
                            price={filteredProducts[i].price}
                            discount={filteredProducts[i].discountPercentage} />
                    </Col>

                    {(i + 1) < filteredProducts.length &&
                        <Col className='mb-5 px-3'>
                            <ProductCard
                                id={filteredProducts[i + 1].id}
                                image={filteredProducts[i + 1].images[0].url}
                                title={filteredProducts[i + 1].title}
                                price={filteredProducts[i + 1].price}
                                discount={filteredProducts[i + 1].discountPercentage} />
                        </Col>
                    }

                    {(i + 2) < filteredProducts.length &&
                        <Col className='mb-5 px-3'>
                            <ProductCard
                                id={filteredProducts[i + 2].id}
                                image={filteredProducts[i + 2].images[0].url}
                                title={filteredProducts[i + 2].title}
                                price={filteredProducts[i + 2].price}
                                discount={filteredProducts[i + 2].discountPercentage} />
                        </Col>
                    }

                    {(i + 3) < filteredProducts.length &&
                        <Col className='mb-5 px-3'>
                            <ProductCard
                                id={filteredProducts[i + 3].id}
                                image={filteredProducts[i + 3].images[0].url}
                                title={filteredProducts[i + 3].title}
                                price={filteredProducts[i + 3].price}
                                discount={filteredProducts[i + 3].discountPercentage} />
                        </Col>
                    }
                </Row>
            );
        }

        return rows;
    }

    // sets filter values and navigates to a new url where the filters are applied
    const applyFilter = (param, filter) => {

        if (param === 'brand') {
            setBrandFilter(filter);
        } else if (param === 'category') {
            setCategoryFilter(filter);
        }

        // get the current path and query params
        const path = location.pathname;
        const params = queryString.parse(search);

        // params without the new filter
        const paramsWithoutFilter = { ...params };
        // check if a filter wa passed
        if (filter) {
            // add filter to the params
            const paramsWithFilter = { ...params };
            paramsWithFilter[param] = filter;
            // add the filter to the current url and navigate to it
            const urlWithFilter = `${path}?${queryString.stringify(paramsWithFilter)}`;
            props.history.push(urlWithFilter);
        } else {
            // remove the current filter from the current url and navigate to the newly generated link
            delete paramsWithoutFilter[param];
            const urlWithoutFilter = `${path}?${queryString.stringify(paramsWithoutFilter)}`;
            props.history.push(urlWithoutFilter);
        }
    }

    return (
        <main className='mb-5'>
            <Header title='Shop' pageTitle='Shop' />

            <div className='responsive-width d-md-flex align-items-center justify-content-between flex-wrap border p-3 px-md-3 py-md-2 mb-3'>
                <div className='mt-md-3'>
                    <p className='text-center'>Page 1 out of 1</p>
                </div>

                <Form.Group className='d-md-flex justify-content-center mt-md-3'>
                    <div className='d-md-flex align-items-center justify-content-center mb-3 mb-md-0 mr-md-5'>
                        <p className='mr-md-2 mt-md-3'>Brand:</p>
                        <Form.Control as='select'
                            value={brandFilter || 'All'}
                            onChange={(e) => applyFilter('brand', e.target.value === 'All' ? null : e.target.value)}>
                            <option>All</option>
                            {getBrands()}
                        </Form.Control>
                    </div>

                    <div className='d-md-flex align-items-center justify-content-center'>
                        <p className='mr-md-2 mt-md-3'>Category:</p>
                        <Form.Control as='select'
                            value={categoryFilter || 'All'}
                            onChange={(e) => applyFilter('category', e.target.value === 'All' ? null : e.target.value)}>
                            <option>All</option>
                            {getCategories()}
                        </Form.Control>
                    </div>

                </Form.Group>

                <div className='mt-md-3'>
                    <p className='text-center'>Showing {getFilteredProducts().length} out of {products.length}</p>
                </div>
            </div>

            {
                products.length < 1 ?
                    <Loading />
                    :
                    <Container fluid className='responsive-width'>
                        {getProducts()}
                    </Container>
            }
        </main>
    );
}