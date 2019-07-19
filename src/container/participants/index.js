import React, {Component} from 'react';
import './style.css';
import axios from 'axios';

class Participant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantList: [],
            inputName: '',
            errors: {
                inputName: '',
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
            })
        } else {
            this.setState({
                inputName: name,
            })
        }
    }

    addParticipant(e) {
        e.preventDefault();

        const url = 'http://localhost:7777/participants/create';
        const {participantList} = this.state;

        axios.post(url, {
            name: this.state.inputName
        }).then((response) => {
            const data = response.data;

            // const {message} = data;
            //
            // if (message.length > 0) {
            //     this.setState({
            //         errors: {
            //             inputName: message
            //         }
            //     });
            //     return;
            // }

            const newParticipantList = participantList;
            newParticipantList.push(data);

            this.setState({
                inputName: '',
                participantList: newParticipantList,
            })
        }).catch((error) => {
            console.log(error);
            this.setState({
                errors: {
                    inputName: "Unexpected Error"
                }
            })
        });
    }

    delParticipant(e, id) {
        e.preventDefault();

        const url = 'http://localhost:7777/participants/' + id + '/delete';
        const self = this;
        const {participantList} = this.state;

        axios.get(url)
            .then(function (response) {
                const newParticipantList = participantList.filter(participant => participant.id !== id);

                self.setState({
                    participantList: newParticipantList
                });
            }).catch(function (error) {
            console.log(error);
            this.setState({
                errors: {
                    inputName: error
                }
            })
        })
    }

    render() {
        const {participantList, inputName, errors} = this.state;
        console.log(participantList.length);

        const {
            changePage, //to change page
            data //send partipant list to invoice from app.js}
        } = this.props;

        const renderList = participantList.map((value, index) => {
            return (
                <tr>
                    <td className="text-center">
                        {index + 1}
                    </td>
                    <td className="text-left">
                        {value.name}
                    </td>

                    <td className="text-center">
                        <button
                            type="button"
                            onClick={e => this.delParticipant(e, value.id)}
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
                            <input
                                type="text"
                                onChange={this.handleInputName}
                                value={inputName}
                                placeholder="Input Name"
                            />

                            {errors.inputName.length > 0 &&
                            <div className="participantMessage">
                                {errors.inputName}
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
                                style={{
                                    disabled: participantList.length < 2 ? 'disabled' : null
                                }}
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