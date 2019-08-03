import React, {Component} from 'react';
import './App.css';
import Invoice from "./invoice";
import Participant from "./participants";
import Home from "./home";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: ['home'],
            participantList: ["a", "b", "c"],
        };

        this.changePage = this.changePage.bind(this);

        this.setParticipantList = this.setParticipantList.bind(this);
    }

    changePage(page) {
        let currentPage = [...this.state.currentPage];
        currentPage.push(page);

        this.setState({
            currentPage
        });

        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
        }, 100);
    };

    setParticipantList(list) {

        this.setState({
            participantList: list
        });
    };

    render() {
        const {currentPage, participantList} = this.state;

        return (
            <div className="container">
                {currentPage.indexOf('home') > -1 && <Home changePage={this.changePage}/>}

                {currentPage.indexOf('participant') > -1 &&
                <Participant changePage={this.changePage} data={this.setParticipantList}/>}

                {currentPage.indexOf('invoice') > -1 &&
                <Invoice changePage={this.changePage} participantList={participantList}/>}
            </div>
        )
    }
}

export default App;
