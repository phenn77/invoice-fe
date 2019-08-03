import React, {Component} from 'react';
import './style.css';

class Participant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantList: [],
            inputName: '',
            displayInputMessage: 'block',
            errors: {
                message: '',
            }
        };

        this.handleInputName = this.handleInputName.bind(this);
        this.addParticipant = this.addParticipant.bind(this);
        this.delParticipant = this.delParticipant.bind(this);
    }

    handleInputName(e) {
        const name = e.target.value;

        if (name !== '') {
            this.setState({
                inputName: name,
                displayInputMessage: 'none',
                errors: {
                    message: ''
                }
            })
        } else {
            this.setState({
                displayInputMessage: 'block',
                inputName: name,
            })
        }
    }

    addParticipant(e) {
        e.preventDefault();

        const {participantList, inputName} = this.state;

        const newParticipantList = participantList;

        if (inputName !== '') {
            const status = newParticipantList.includes(inputName);

            if (status === true) {
                this.setState({
                    errors: {
                        message: "Same name ? Nah you can't"
                    }
                })
            } else {
                newParticipantList.push(inputName);
            }
        } else {
            this.setState({
                errors: {
                    message: 'Ohh come on, no name ??'
                }
            })
        }

        this.setState({
            inputName: '',
            participantList: newParticipantList,
        });

        this.props.data(newParticipantList);
    }

    // delParticipant(e, id) {
    delParticipant(e, index) {
        e.preventDefault();

        const {participantList} = this.state;

        const newParticipant = participantList;
        newParticipant.splice(index, 1);

        this.setState({
            participantList: newParticipant
        });

        this.props.data(newParticipant);
    }

    render() {
        const {participantList, inputName, errors, displayInputMessage} = this.state;

        const isDisabled = participantList.length < 2;

        const {
            changePage, //to change page
            data //send participant list to invoice from app.js}
        } = this.props;

        const renderList = participantList.map((value, index) => {
            return (
                <tr>
                    <td className="text-center">
                        {index + 1}
                    </td>
                    <td className="text-left">
                        {/*{value.name}*/}
                        {value}
                    </td>

                    <td className="text-center">
                        <button
                            type="button"
                            // onClick={e => this.delParticipant(e, value.id)}
                            onClick={e => this.delParticipant(e, index)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="content">
                <h2 className="heading">
                    PARTICIPANTS
                </h2>

                <div className="participantContent">
                    <div className="inputContent">
                        <form onSubmit={this.addParticipant} className="inputForm" style={{position: 'relative'}}>
                            <div className="inputMessage" style={{display: displayInputMessage}}>
                                Kindly add the name please
                            </div>

                            <input
                                type="text"
                                onChange={this.handleInputName}
                                value={inputName}
                                placeholder="Input Name"
                                maxLength="15"
                            />

                            {errors.message.length > 0 &&
                            <div className="participantMessage">
                                {errors.message}
                            </div>}

                            <button type="submit"> Add</button>
                        </form>
                    </div>

                    <div className="tableContent">
                        <div className="setOverflow">
                            <table className="participantTable">
                                <thead>
                                <th style={{width: 40}}>No</th>
                                <th className="text-left">Name</th>
                                <th className="text-center" style={{width: 70}}>Action</th>
                                </thead>
                                <tbody>
                                {renderList}
                                </tbody>
                            </table>
                        </div>

                        <div className="done-btn">
                            <button
                                onClick={() => {
                                    changePage("invoice");
                                    data(participantList);
                                }}
                                disabled={isDisabled}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Participant;