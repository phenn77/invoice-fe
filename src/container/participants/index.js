import React, {Component} from 'react';
import './style.css';
import axios from 'axios';
import Invoice from "../invoice";

class Participant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantList: [],
            inputName: '',
            buttonStatus: true
        };

        this.handleInputName = this.handleInputName.bind(this);
        this.addParticipant = this.addParticipant.bind(this);
        this.delParticipant = this.delParticipant.bind(this);

        this.submitParticipant = this.submitParticipant.bind(this);
    }

    handleInputName(e) {
        const name = e.target.value;

        if (name === '') {
            this.setState({
                buttonStatus: true
            })
        } else {
            this.setState({
                inputName: name,
                buttonStatus: false
            })
        }
    }

    addParticipant(e) {
        e.preventDefault();

        const url = 'http://localhost:7777/participants/create';
        const self = this;
        const {participantList} = self.state;

        axios.post(url, {
            name: this.state.inputName
        }).then(function (response) {
            const data = response.data;

            const newParticipantList = participantList;
            newParticipantList.push(data);

            self.setState({
                inputName: '',
                participantList: newParticipantList
            })
        }).catch(function (error) {
            console.log(error);
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
        })
    }

    /* Not done */
    submitParticipant(e) {
        e.preventDefault();

        const {participantList} = this.state;
console.log(participantList);
        return (
            <Invoice participants={participantList}/>
        )
    }

    render() {
        const {participantList, inputName, buttonStatus} = this.state;

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
                <h2 className="text-center">
                    PARTICIPANTS
                </h2>

                <div className="participantContent">
                    <div className="inputContent">
                        <form onSubmit={this.addParticipant} className="inputForm">
                            <input
                                type="text"
                                onChange={this.handleInputName}
                                value={inputName}
                                placeholder="Input Name"
                            />

                            <button type="submit" disabled={buttonStatus}> Add</button>
                        </form>
                    </div>

                    <div className="tableContent">
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

                        <div className="done-btn">
                            <button onClick={e => this.submitParticipant(e)}>
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