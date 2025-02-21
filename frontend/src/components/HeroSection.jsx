import React from 'react'
import HeroImg from '../assets/HeroImg.png'
import stars from '../assets/stars.svg'
import sugar_free from '../assets/sugar_free.png'
import gmo_free from '../assets/gmo_free.png'
import gluten_free from '../assets/gluten_free.png'
import vegan from '../assets/vegan.png'
import paleo from '../assets/paleo.png'
import lab_tested from '../assets/lab_tested.png'
import no_binders from '../assets/no_binders.png'
import '../styles/HeroSection.scss'
import { useNavigate } from 'react-router-dom'


const HeroSection = () => {

    const navigate = useNavigate()
    return (
        <div className='hero-section'>
            <div className='hero-container'>
                <div className='hero-image'>
                    <img src={HeroImg} alt="heroImg" />
                </div>
                <div className="hero-content">
                    <h1>Supercharge Your Day with Mushroom Coffee</h1>
                    <div className='stars'>
                        <img src={stars} alt="" />
                        <p>2160 Reviews</p>
                    </div>
                    <h5>
                        WITH 6 POWERFUL NOOTROPICS THAT TASTE "
                        <span className='purple-color'>OHM-MAZZING!</span>
                    </h5>
                    <div className="banner-icons">
                        <div className="banner-icon">
                            <img src={sugar_free} alt="" />
                        </div>
                        <div className="banner-icon">
                            <img src={gmo_free} alt="" />
                        </div>
                        <div className="banner-icon">
                            <img src={gluten_free} alt="" />
                        </div>
                        <div className="banner-icon">
                            <img src={vegan} alt="" />
                        </div>
                        <div className="banner-icon">
                            <img src={paleo} alt="" />
                        </div>
                        <div className="banner-icon">
                            <img src={lab_tested} alt="" />
                        </div>
                        <div className="banner-icon">
                            <img src={no_binders} alt="" />
                        </div>
                    </div>
                    <button className='hero-button' onClick={() => navigate('/collections/all?showProducts=true')}>
                        SHOP NOW
                    </button>


                </div>
            </div>
        </div>
    )
}

export default HeroSection