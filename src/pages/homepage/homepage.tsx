import React from 'react';
import './homepage.css';

const HomePage: React.FC = () => {
    return (
        <div className="homepage-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Coordinator Helper</h1>
                    <p>Лучший инструмент координатора для удобной работы</p>
                    <button className="cta-button">Get Started</button>
                </div>
            </section>

            <section className="features-section">
                <h2>Features</h2>
                <div className="features-container">
                    <div className="feature-card">
                        <h3>Todo List</h3>
                        <p>Список задач, чтобы ставить себе цели и не забывать их выполнять</p>
                    </div>
                    <div className="feature-card">
                        <h3>Шаблоны</h3>
                        <p>Готовые шаблоны текста заказчикам для подтверждения</p>
                    </div>
                    <div className="feature-card">
                        <h3>Маршрутизация</h3>
                        <p>Загружаете локации, время игр, и сайт сам составит для вас оптимизированные команды,
                        где игры находятся близко друг к другу</p>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <h2>About Show Today</h2>
                <p>
                    Show Today является первым развлекательным шоу в городе Алматы по мотивам телепередач,
                    где две команды сражаются друг против друга на протяжении нескольких конкурсов,
                    по окончанию которых, команда набравшая наибольшее количество баллов побеждают в шоу
                    и проходят в суперигру
                </p>
            </section>

            <section className="contact-section">
                <h2>Contact Developer</h2>
                <p>Have questions? Reach out to developer in Telegram.</p>
                <button
                    className="cta-button"
                    onClick={() => window.open('https://t.me/KhanWarden', '_blank')}
                >
                    Contact Developer
                </button>
            </section>
        </div>
    );
};

export default HomePage;
