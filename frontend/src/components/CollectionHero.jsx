import React from 'react'
import '../styles/CollectionHero.scss'
const CollectionHero = () => {
    return (
        <div className='collection-container'>
            <div className="collection-hero">
                <div className="collection-breadcrumbs">
                    <a onClick={() => navigate("/")} title="Back to the Homepage">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.8367 19.3H5.50337C3.9867 19.3 2.60337 18.1333 2.35337 16.6333L1.24504 10C1.07004 8.96668 1.57004 7.64168 2.39504 6.98335L8.17004 2.35835C9.2867 1.45835 11.045 1.46668 12.17 2.36668L17.945 6.98335C18.7617 7.64168 19.2617 8.96668 19.095 10L17.9867 16.6333C17.7367 18.1083 16.3284 19.3 14.8367 19.3V19.3ZM10.1617 2.95001C9.72004 2.95001 9.27837 3.08335 8.95337 3.34168L3.17837 7.96668C2.70337 8.35001 2.37837 9.20001 2.47837 9.80001L3.5867 16.4333C3.7367 17.3083 4.6117 18.05 5.50337 18.05H14.8367C15.7284 18.05 16.6034 17.3083 16.7534 16.425L17.8617 9.79168C17.9617 9.19168 17.6284 8.33335 17.1617 7.95835L11.3867 3.34168C11.0534 3.08335 10.6117 2.95001 10.1617 2.95001V2.95001Z" fill="white"></path><path d="M10.17 14.0417C8.67834 14.0417 7.46167 12.825 7.46167 11.3333C7.46167 9.84167 8.67834 8.625 10.17 8.625C11.6617 8.625 12.8783 9.84167 12.8783 11.3333C12.8783 12.825 11.6617 14.0417 10.17 14.0417ZM10.17 9.875C9.37 9.875 8.71167 10.5333 8.71167 11.3333C8.71167 12.1333 9.37 12.7917 10.17 12.7917C10.97 12.7917 11.6283 12.1333 11.6283 11.3333C11.6283 10.5333 10.97 9.875 10.17 9.875Z" fill="white"></path>
                        </svg>
                    </a>
                    <span className="breadcrumbs-sep">/</span>
                    <a onClick={() => navigate("/collections/all?showProducts=true")}><span>Collections</span></a>
                    <span className="breadcrumbs-sep">/</span>
                    All Products
                </div>
                <h1>Our Products</h1>
                <h5>
                    Take your coffee with you wherever you go with our delicious, superfood instant coffee and espresso sticks. Each pack contains adaptogens and mushroom powder as well as cream and sugar for a rich, satisfying taste!
                </h5>

                <div className="collection-desc-images">
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/sugar_free.png?v=1671096441" height='60vh' />
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/lab_tested.png?v=1671096454" height='60vh' />
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/gluten_free.png?v=1671096454" height='60vh' />
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/paleo.png?v=1671096454" height='60vh' />
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/vegan.png?v=1671096454" height='60vh' />
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/no_binders.png?v=1671096454" height='60vh' />
                    <img src="//gratefulearthcoffee.com/cdn/shop/files/gmo_free.png?v=1671096454" height='60vh' />
                </div>
            </div>
        </div>
    )
}

export default CollectionHero