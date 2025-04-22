import React, { useState } from "react";
import "./templates.css";

const TemplatesPage: React.FC = () => {
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place, setPlace] = useState("");
    const [format, setFormat] = useState("");
    const [duration, setDuration] = useState("");
    const [language, setLanguage] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const finalText = `
        Здравствуйте, ${customer || "[Имя заказчика]"}!
    
        Меня зовут Батырхан, я координатор «Show Today».
        У нас с Вами *на завтра (${date || "[дд.мм]"})* запланировано мероприятие *в ${time || "[время]"} в "${place || "заведение"}"*.
        
        Формат игры: ${format || "[формат игры]"}.
        Длительность: ${duration || "[время]"} ч.
        Язык проведения: ${language || "[язык]"}.
        
        Подскажите, пожалуйста, всё ли верно и остаётся без изменений?
    `.trim();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(finalText).then(() => {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000)
        });
    }

    return (
        <>
            {showNotification && <div className="notification">Скопировано!</div>}
            <div className="template-container">
                <div className="form-section">
                    <label>Имя заказчика:
                        <input name="name" value={customer} onChange={e => setCustomer(e.target.value)} />
                    </label>
                    <label>Дата мероприятия:
                        <input name="date" value={date} onChange={e => setDate(e.target.value)} />
                    </label>
                    <label>Время:
                        <input name="time" value={time} onChange={e => setTime(e.target.value)} />
                    </label>
                    <label>Название заведения:
                        <input name="place" value={place} onChange={e => setPlace(e.target.value)} />
                    </label>
                    <label>Формат игры:
                        <input name="format" value={format} onChange={e => setFormat(e.target.value)} />
                    </label>
                    <label>Длительность (часы):
                        <input name="duration" value={duration} onChange={e  => setDuration(e.target.value)} />
                    </label>
                    <label>Язык проведения:
                        <select name="language" value={language} onChange={e  => setLanguage(e.target.value)}>
                            <option value="">Выберите язык</option>
                            <option value="русский">Русский</option>
                            <option value="английский">Английский</option>
                            <option value="казахский">Казахский</option>
                        </select>
                    </label>
                </div>

                <div className="preview-section">
                    <p>{finalText}</p>
                    <button className="copy-button" onClick={copyToClipboard}><b>Скопировать</b></button>
                </div>
            </div>
        </>
    );
};

export default TemplatesPage;