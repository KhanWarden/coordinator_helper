import { useEffect, useState } from 'react'
import {getSchedule, getTeamStaff, saveSchedule} from '../../services/scheduleApi'
import './schedulepage.css'

interface ScheduleItem {
    id: number
    start_time: string
    end_time: string
    catalog: string
    title: string | null
    parameter_values: Record<string, string>
}

interface TeamData {
    items: ScheduleItem[];
    inputs: string[];
    editable: boolean[];
}

const extractTeamNumber = (team: string): number => {
    const match = team.match(/\d+/)
    return match ? parseInt(match[0]) : 0
}

const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}

const getLangTag = (lang: string) => {
    if (/Казах/i.test(lang)) return ' (KZ)'
    if (/Англ/i.test(lang)) return ' (EN)'
    return ''
}

const getPlacePrefix = (place?: string) => {
    if (!place) return 'В'
    return /Студия/i.test(place) ? 'С' : 'В'
}

const extract2GisLink = (address: string) => {
    const parts = address.split('\n');
    return parts.find(p => p.includes('2gis')) || '';
}

const formatDateToISO = (ddmm: string) => {
    const [day, month] = ddmm.split('.')
    const year = new Date().getFullYear()
    return `${year}-${month}-${day}`
}

const SchedulePage = () => {
    const [groupedSchedule, setGroupedSchedule] = useState<Record<string, TeamData>>({})
    const [inputDate, setInputDate] = useState('')
    const [selectedDate, setSelectedDate] = useState('')

    useEffect(() => {
        if (!selectedDate) return;

        const fetchScheduleWithTeams = async () => {
            try {
                const schedule = await getSchedule(selectedDate);

                let people = null;
                try {
                    people = await getTeamStaff(selectedDate);
                } catch (error: any) {
                    if (error?.response?.status !== 404) {
                        console.error('Ошибка при получении данных по людям:', error);
                    } else {
                        console.log('Нет данных по людям — загружаем только расписание.');
                    }
                }

                const grouped: Record<string, TeamData> = {};

                for (const item of schedule) {
                    const team = item.catalog;
                    if (!grouped[team]) {
                        const staff = people?.teams?.[team] || {};
                        grouped[team] = {
                            items: [],
                            inputs: [
                                staff.host || '',
                                staff.dj || '',
                                staff.cohost || ''
                            ],
                            editable: [false, false, false]
                        };
                    }
                    grouped[team].items.push(item);
                }

                setGroupedSchedule(grouped);
            } catch (error) {
                console.error('Ошибка при загрузке расписания:', error);
            }
        };

        fetchScheduleWithTeams();
    }, [selectedDate]);

    const handleInputChange = (team: string, index: number, value: string) => {
        const updated = { ...groupedSchedule }
        updated[team].inputs[index] = value
        setGroupedSchedule(updated)
    }

    const handleSave = async () => {
        const result: any = { teams: {} };

        const sortedTeams = Object.entries(groupedSchedule).sort(
            ([teamA], [teamB]) => extractTeamNumber(teamA) - extractTeamNumber(teamB)
        );

        const firstTeam = sortedTeams[0]?.[1];
        const firstItem = firstTeam?.items[0];
        const scheduleDate = firstItem ? firstItem.start_time.split('T')[0] : null;

        for (const [team, data] of sortedTeams) {
            result.teams[team] = {
                host: data.inputs[0] || '',
                dj: data.inputs[1] || '',
                cohost: data.inputs[2] || ''
            };
        }

        try {
            await saveSchedule(scheduleDate, result.teams);
            alert("Сохранено");
        } catch (err) {
            alert("Ошибка при сохранении");
            console.error(err);
        }
    };

    return (
        <div className="schedule-container">
            <h2>Расписание</h2>
            <div className="date-input-wrapper">
                <input
                    type="text"
                    placeholder="Введите дату (ДД.ММ)"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                />
                <button onClick={() => {
                    if (/^\d{2}\.\d{2}$/.test(inputDate)) {
                        setSelectedDate(formatDateToISO(inputDate))
                    } else {
                        alert("Введите дату в формате ДД.ММ")
                    }
                }}>
                    Загрузить расписание
                </button>
            </div>

            {Object.entries(groupedSchedule)
                .sort(([teamA], [teamB]) => extractTeamNumber(teamA) - extractTeamNumber(teamB))
                .map(([team, data]) => (
                    <div key={team} className="team-block">
                        <strong>{team}:</strong>
                        {data.items.map(item => {
                            const start = formatTime(item.start_time)
                            const end = formatTime(item.end_time)
                            const placeType = getPlacePrefix(item.parameter_values['Место проведения'])
                            const format = item.parameter_values['Формат игры']?.replace(/[^а-яА-Яa-zA-Z]/g, '').toUpperCase() || ''
                            const lang = getLangTag(item.parameter_values['Язык'])
                            const address = item.parameter_values['Адрес'] || ''
                            const isArriva = item.title?.toUpperCase() || ""

                            return (
                                <div key={item.id}>
                                    <div>
                                        • {start}–{end}&nbsp;
                                        <a href={`https://plus-erp.app/sales/order/preview/${item.id}?tab=description`}>
                                            {placeType}{format}
                                        </a>
                                        &nbsp;{isArriva}{lang}
                                    </div>
                                    {placeType === 'В' && extract2GisLink(address) && (
                                        <div className="address-line">
                                            <a href={extract2GisLink(address)} target="_blank" rel="noopener noreferrer">2ГИС</a>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        <div className="inputs-row">
                            {data.inputs.map((val, i) => (
                                <div key={i} className="input-with-edit">
                                    <input
                                        type="text"
                                        value={val}
                                        placeholder={['Ведущий', 'Диджей', 'Соведущий'][i]}
                                        disabled={!data.editable[i]}
                                        onChange={e => handleInputChange(team, i, e.target.value)}
                                    />
                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            const updated = { ...groupedSchedule };
                                            updated[team].editable[i] = true;
                                            setGroupedSchedule(updated);
                                        }}
                                    >
                                        ✏️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            {Object.keys(groupedSchedule).length > 0 && (
                <button className="save-button" onClick={handleSave}>Сохранить</button>
            )}
        </div>
    )
}

export default SchedulePage
