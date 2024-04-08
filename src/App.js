import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { createBrowserHistory } from 'history';

import "react-toastify/dist/ReactToastify.css";

import './App.css';

import LoginForm from './pages/LoginForm';
import CheckForm from './pages/CheckForm';

export const history = createBrowserHistory();

function App() {

    return (
        <BrowserRouter history={history}>
            <Routes>
                <Route exact path="/" element={<LoginForm />}></Route>
                <Route exact path="/form" element={<CheckForm />}></Route>
            </Routes>
            <ToastContainer position="top-right" autoClose="4000" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable theme="colored" />
        </BrowserRouter>
    );
}

export default App;
