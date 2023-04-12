import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/cg'
import './Home.css'
import ProductCard from './ProductCard'
import Metadata from '../layout/Metadata'
import { clearErrors, getProduct } from '../../Actions/ProductAction'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'

function Home() {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(
        state => state.products);

    useEffect(() => {
        if(error){
             alert.error(error);
             dispatch(clearErrors());
        }

        dispatch(getProduct())
    }, [dispatch,error,alert]);


    return (
        <Fragment>

            {loading ? <Loader/> : (
                <Fragment>
                    <Metadata title="Ecommerce" />
                    <div className="banner">
                        <p>Welcome to Ecommerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll<CgMouse />
                            </button>
                        </a>
                    </div>
                    <h2 className='homeHeading'>Featured Product</h2>

                    <div className="container" id="container">
                        {products && products.map((product) => <ProductCard key={product._id} product={product} />)}
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}

export default Home
