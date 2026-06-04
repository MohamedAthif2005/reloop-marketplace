import React from "react"
import { useNavigate, Link } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"

function LandingPage() {
    const navigate = useNavigate()
    useDocumentTitle("Reloop | Home")

    return (
        <div className="container">
            <header className="header">
                <div className="logo">RELOOP</div>
                <nav className="nav">
                    <Link className="nav-link" to="/register">Register</Link>
                    <Link className="nav-link" to="/login">Login</Link>
                    <Link className="nav-link" to="/contact">Contact</Link>
                </nav>
            </header>

            <section className="hero" id="home">
                <h1 className="hero-title">Welcome to Reloop</h1>
                <h2 className="hero-subtitle">Premium Second-Hand Turf Solutions</h2>
                <p className="hero-description">
                    Discover high-quality, eco-friendly second-hand turf for your projects. 
                    Get started with sustainable landscaping solutions today!
                </p>
                <button className="cta-button" type="button" onClick={() => navigate("/register")}>Browse Products</button>
            </section>

            <section className="features">
                <div className="feature-card">
                    <div className="feature-icon">🌱</div>
                    <h3 className="feature-title">Eco-Friendly</h3>
                    <p className="feature-text">
                        Sustainable second-hand turf solutions that benefit the environment
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💰</div>
                    <h3 className="feature-title">Affordable Prices</h3>
                    <p className="feature-text">
                        Get premium quality turf at unbeatable prices
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">♻️</div>
                    <h3 className="feature-title">Smart Reuse</h3>
                    <p className="feature-text">
Give products a second life and reduce unnecessary waste                    </p>
                </div>
            </section>

            <section className="about" id="about">
                <h2 className="section-title">About Reloop</h2><br />
                <p className="about-text">
                    Welcome to ReLoop - a platform built to make buying and selling secondhand products simple, affordable, and trustworthy.
                    Our goal is to give terms a second life by connecting people who want to sell products they no longer need with people looking for great deals.
                    <br></br>Post products, explore listings and connect with buyers and sellers in one place.
                </p>
            </section>
            <footer className="footer">
                <p className="footer-text">
                    © 2026 Reloop. All rights reserved. | Sustainable Turf Solutions for a Better Tomorrow
                </p>
            </footer>
        </div>
    )
}

export default LandingPage