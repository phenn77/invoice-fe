import React, {Component} from 'react';
import Participant from "../../participants";
import './style.css';

class Invoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantList: [],
            details: [],
            inputName: '',
            inputPrice: 0,
            total: 0,
            tax: 0,
            serviceCharge: 0,
            inputService: 0,
            grandTotal: 0,
            eachAmount: []
        };

        this.submitForm = this.submitForm.bind(this);
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputPrice = this.handleInputPrice.bind(this);
        this.handleInputServiceCharge = this.handleInputServiceCharge.bind(this);
    }

    handleInputName(e) {
        const name = e.target.value;

        this.setState({
            inputName: name
        })
    }

    handleInputPrice(e) {
        const price = e.target.value;

        this.setState({
            inputPrice: price,
        })
    }

    handleInputServiceCharge(e) {
        const servCharge = parseInt(e.target.value);
        const totalPrice = this.state.total;

        const serviceChargeAmount = totalPrice * (servCharge / 100);

        const totalPlusService = totalPrice + serviceChargeAmount;

        const taxAmount = totalPlusService * 0.1;

        const grandTotal = totalPlusService + taxAmount;

        this.setState({
            serviceCharge: Math.round(serviceChargeAmount),
            tax: Math.round(taxAmount),
            grandTotal: Math.round(grandTotal)
        })
    }

    deleteDetail(index, price) {
        const {details, total} = this.state;

        const newDetails = details;
        newDetails.splice(index, 1);

        this.setState({
            details: newDetails,
            total: total - price
        });
    }

    submitForm(e) {
        e.preventDefault();

        const {inputName, inputPrice, total} = this.state;

        const newTotal = total + parseInt(inputPrice);

        if (inputName !== '' && inputPrice !== 0) {
            this.setState(prevState => ({
                    details: [
                        ...prevState.details,
                        {
                            name: inputName,
                            price: inputPrice
                        }
                    ],
                    inputName: '',
                    inputPrice: 0,
                    total: newTotal
                })
            )
        }
    }

    render() {
        const {inputName, inputPrice, details, total, serviceCharge, inputService, tax, grandTotal} = this.state;

        const detailsRender = details.map((value, index) => {
            return (
                <tr>
                    <td style={{width: 30}}>
                        {index + 1}
                    </td>
                    <td>
                        {value.name}
                    </td>
                    <td>
                        {value.price}
                    </td>
                    <td style={{width: 50}}>
                        <button
                            type="button"
                            onClick={e => this.deleteDetail(index, value.price)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="invoice-container">
                <form onSubmit={this.submitForm}>
                    <input
                        type="text"
                        onChange={this.handleInputName}
                        value={inputName}
                        placeholder="Input Name"
                    />

                    <input
                        type="number"
                        onChange={this.handleInputPrice}
                        value={inputPrice}
                        placeholder="Input Price"
                    />

                    <button type="submit"> Add</button>
                </form>

                <div>
                    <table className="invoice-detail">
                        {detailsRender}
                        <tr>
                            <td colSpan={2}>Total</td>
                            <td>{total}</td>
                        </tr>
                        <tr>
                            <td>Service</td>
                            <td>
                                <form>
                                    <input
                                        type="number"
                                        onChange={this.handleInputServiceCharge}
                                        value={inputService}
                                        step="0.5"
                                        min="0"
                                        max="20"
                                    />
                                </form>
                            </td>
                            <td>{serviceCharge}</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>10%</td>
                            <td>{tax}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Grand Total</td>
                            <td>{grandTotal}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}

export default Invoice;