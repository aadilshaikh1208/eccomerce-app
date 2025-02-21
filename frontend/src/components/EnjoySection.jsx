import React from 'react'
import '../styles/EnjoySection.scss'
const EnjoySection = () => {
    return (
        <div className='enjoy-section'>
            <div className="cards-container">
                <h2>How to Enjoy</h2>
                <div className="cards-inner-container">
                    <div className="card">
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/Frame_29_150x.png?v=1671185844" height="95x" width="104px"></img>
                        <div>Pour contents into a cup</div>
                    </div>
                    <div className="card">
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/Frame_30_150x.png?v=1671185863" height="95x" width="104px"></img>
                        <div>Add 6 fl oz. hot or cold water</div>
                    </div>
                    <div className="card">
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/Frame_31_150x.png?v=1671185875" height="95x" width="104px"></img>
                        <div>Stir, enjoy and love</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnjoySection