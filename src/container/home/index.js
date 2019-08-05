import React, {Component} from 'react';
import './style.css';

const foodQuote = require('../../component/template/food');

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changePage} = this.props;

        /* Set Quote */
        const num = Math.floor((Math.random() * 58) + 1);
        const getQuote = foodQuote(num);
        /* Set Quote */

        return (
            <div className="content home">
                <h2>
                    Invoice Calculator
                </h2>
                <div className="home-container">
                    <div className="instructions">
                        <div className="instructs-content">
                            <fieldset>
                                <legend>Instructions</legend>
                                <ul>
                                    <li>
                                        Add Participant
                                    </li>
                                    <li>
                                        Input the Invoice's name
                                    </li>
                                    <li>
                                        Input the details (name & price)
                                    </li>
                                    <li>
                                        Separate to each participant's
                                    </li>
                                    <li>
                                        There you go, the amount for each person.
                                    </li>
                                </ul>
                            </fieldset>
                        </div>
                    </div>

                    <div className="quote">
                        <h4 className="header">
                            {getQuote}
                        </h4>
                    </div>
                </div>
                <div>
                    <button onClick={() => changePage('participant')}>
                        Get Started
                    </button>
                </div>
            </div>
        );
    }
}

export default Home;