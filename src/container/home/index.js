import React, {Component} from 'react';
import './style.css';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changePage} = this.props;
        return (
            <div className="content home-container">
                <button onClick={() => changePage('participant')}>
                    Get Started
                </button>
            </div>
        );
    }
}

export default Home;