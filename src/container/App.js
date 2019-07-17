import React from 'react';
import './App.css';
import Invoice from "./invoice";
import Participant from "./participants";
import Home from "./home";

function App() {
    return (
        <div className="container">
            <Home/>
            <Participant/>
            <Invoice/>
        </div>
    );
}

export default App;
