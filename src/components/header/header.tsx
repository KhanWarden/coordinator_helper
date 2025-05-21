import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
            <div className="container">
                <Link to="/" className="navbar-brand brand">Coordinator Helper</Link>

                <button
                    className="navbar-toggler custom-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-links">
                        <li className="nav-item nav-item-custom">
                            <Link to="/todolist" className="nav-link">Список дел</Link>
                        </li>

                        <li className="nav-item dropdown nav-item-custom dropdown-custom">
                            <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Скрипты
                            </span>
                            <ul className="dropdown-menu show-on-hover">
                                <li>
                                    <Link to="/confirm" className="dropdown-item dropdown-item-custom">Подтверждение</Link>
                                </li>
                                <li>
                                    <Link to="/confirm" className="dropdown-item dropdown-item-custom">Играли ранее?</Link>
                                </li>
                                <li>
                                    <Link to="/confirm" className="dropdown-item dropdown-item-custom">Наличие экрана?</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item nav-item-custom">
                            <Link to="/schedule" className="nav-link">Расписание</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
