import React from "react"
import { Link } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"

function ContactPage() {
    useDocumentTitle("Reloop | Contact")

    return (
        <div className="container">
            <header className="header">
                <div className="logo">RELOOP</div>
                <nav className="nav">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/register">Register</Link>
                    <Link className="nav-link" to="/login">Login</Link>
                </nav>
            </header>

            <section className="hero register-hero">
                <div className="register-card contact-card">
                    <h1 className="section-title">Contact</h1>
                    <p className="section-subtitle">Still under development</p>
                    <div className="contact-details">
                        <a className="contact-link" href="mailto:athifcomrade@gmail.com">
                            <svg className="contact-icon" width="24" height="24" aria-hidden="true">
                                <use href="/icons.svg#social-icon" />
                            </svg>
                            athifcomrade@gmail.com
                        </a>
                        <a className="contact-link" href="https://github.com/MohamedAthif2005" target="_blank" rel="noreferrer">
                            <svg className="contact-icon" width="24" height="24" aria-hidden="true">
                                <use href="/icons.svg#github-icon" />
                            </svg>
                            MohamedAthif2005
                        </a>
                        <a className="contact-link" href="https://www.linkedin.com/in/mohamed-athif-9607b3361/" target="_blank" rel="noreferrer">
                            <svg className="contact-icon" width="24" height="24" aria-hidden="true">
                                <use href="/icons.svg#documentation-icon" />
                            </svg>
                            linkedin.com/in/mohamed-athif-9607b3361
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ContactPage
