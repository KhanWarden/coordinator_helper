import { Route, Routes } from "react-router-dom"
import Header from './components/header'
import {HomePage, TemplatesPage, TodoListPage, SchedulePage} from './pages/'

function App() {
    return (
        <>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/confirm" element={<TemplatesPage />} />
                    <Route path="/todolist" element={<TodoListPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
