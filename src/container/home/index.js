import React, {Component} from 'react';
import './style.css';

const foodQuote = require('../../component/template/food');

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changePage} = this.props;

        const num = Math.floor((Math.random() * 58) + 1);

        const getQuote = foodQuote(num);

        return (
            <div className="content home-container">
                <h4 className="header">
                    {getQuote}
                </h4>

                <button onClick={() => changePage('participant')}>
                    Get Started
                </button>
            </div>
        );
    }
}

export default Home;