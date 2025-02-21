import React, { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Products from '../components/Products'
import CollectionHero from '../components/CollectionHero'

const Collection = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const showProducts = searchParams.get('showProducts') === 'true';
    const productsRef = useRef(null);

    useEffect(() => {
        if (showProducts && productsRef.current) {
            productsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showProducts]);

    return (
        <div>
            <CollectionHero />
            <div ref={productsRef}>
                <Products />
            </div>
        </div>
    )
}

export default Collection
