import { useEffect, useState } from 'react'
import { getSchedule } from '../../services/scheduleApi'
import axios from 'axios'
import './schedulepage.css'

interface ScheduleItem {
    id: number
    start_time: string
    end_time: string
    catalog: string
    parameter_values: Record<string, string>
}

interface TeamData {
    items: ScheduleItem[]
    inputs: string[]
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
        if (!selectedDate) return

        getSchedule(selectedDate)
            .then(data => {
                const grouped: Record<string, TeamData> = {}
                for (const item of data) {
                    const team = item.catalog
                    if (!grouped[team]) {
                        grouped[team] = { items: [], inputs: ['', '', ''] }
                    }
                    grouped[team].items.push(item)
                }
                setGroupedSchedule(grouped)
            })
            .catch(console.error)
    }, [selectedDate])

    const handleInputChange = (team: string, index: number, value: string) => {
        const updated = { ...groupedSchedule }
        updated[team].inputs[index] = value
        setGroupedSchedule(updated)
    }

    const handleSave = async () => {
        const result: any = { teams: {} }

        const sortedTeams = Object.entries(groupedSchedule).sort(
            ([teamA], [teamB]) => extractTeamNumber(teamA) - extractTeamNumber(teamB)
        )

        const firstTeam = sortedTeams[0]?.[1]
        const firstItem = firstTeam?.items[0]
        const scheduleDate = firstItem ? firstItem.start_time.split('T')[0] : null

        for (const [team, data] of sortedTeams) {
            const teamData = {
                games: {} as Record<string, string>,
                staff: {
                    host: data.inputs[0],
                    dj: data.inputs[1],
                    cohost: data.inputs[2]
                }
            }

            for (const item of data.items) {
                const start = formatTime(item.start_time)
                const end = formatTime(item.end_time)
                const placeType = getPlacePrefix(item.parameter_values['Место проведения'])
                const formatRaw = item.parameter_values['Формат игры']
                const format = formatRaw ? formatRaw.replace(/[^а-яА-Яa-zA-Z]/g, '').toUpperCase() : ''
                const lang = getLangTag(item.parameter_values['Язык'])

                let line = `• ${start}–${end} ${placeType}${format}${lang}`

                if (placeType === 'В') {
                    const link = extract2GisLink(item.parameter_values['Адрес'] || '')
                    if (link) line += `\n${link}`
                }

                teamData.games[item.id] = line
            }

            result.teams[team] = teamData
        }

        try {
            await axios.post('https://api.taldybayev.ru/api/v1/schedule/', {
                date: scheduleDate,
                teams: result.teams
            })
            alert("Сохранено")
        } catch (err) {
            console.error(err)
            alert("Ошибка при сохранении")
        }
    }

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

                            return (
                                <div key={item.id}>
                                    <div>
                                        • {start}–{end} {placeType}{format}{lang}
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
                                <input
                                    key={i}
                                    type="text"
                                    value={val}
                                    placeholder={['Ведущий', 'Диджей', 'Соведущий'][i]}
                                    onChange={e => handleInputChange(team, i, e.target.value)}
                                />
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
