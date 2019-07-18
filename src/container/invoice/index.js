import React, {Component} from 'react';
import './style.css';

import axios from 'axios';

class Invoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantList: [],
            invoiceName: '',
            inputInvoiceName: '',
            viewName: 'none', //to show h1 of invoice name
            inputNameForm: 'block', //form to show input invoice name
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

        this.submitInvoiceName = this.submitInvoiceName.bind(this);
        this.handleInputInvoiceName = this.handleInputInvoiceName.bind(this);
        this.editName = this.editName.bind(this);

        this.submitForm = this.submitForm.bind(this);
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputPrice = this.handleInputPrice.bind(this);
        this.handleInputServiceCharge = this.handleInputServiceCharge.bind(this);
    }

    componentDidMount() {
        const url = 'http://localhost:7777/participants';

        axios.get(url)
            .then(response => {
                const data = response.data;

                this.setState({
                    participantList: data
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleInputInvoiceName(e) {
        const invName = e.target.value;

        this.setState({
            inputInvoiceName: invName
        });
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

    submitInvoiceName(e) {
        e.preventDefault();

        const {inputInvoiceName} = this.state;

        if (inputInvoiceName !== '') {
            this.setState({
                invoiceName: inputInvoiceName,
                viewName: 'block',
                inputNameForm: 'none'
            });
        }
    }

    editName(e) {
        e.preventDefault();

        this.setState({
            viewName: 'none',
            inputNameForm: 'block'
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
        const {
            participantList, inputInvoiceName, inputName, inputPrice,
            details, total, serviceCharge, inputService, tax, grandTotal,
            invoiceName, viewName, inputNameForm
        } = this.state;

        const participantName = participantList.map((value) => {
            return (
                <th>
                    {value.name}
                </th>
            );
        });

        const participantInput = participantList.map((dt) => {
            return (
                <td>
                    <form>
                        <input
                            type="checkbox"
                            value={dt.id}
                        />
                    </form>
                </td>
            );
        });

        const detailsRender = details.map((value, index) => {
            return (
                <tr>
                    <td className="text-center">
                        {index + 1}
                    </td>
                    <td className="padLeft">
                        {value.name}
                    </td>
                    <td className="text-right padRight number-spacing">
                        {value.price}
                    </td>

                    {participantInput}

                    <td className="text-center">
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
            <div className="content invoice-container">
                <div className="invoice-input-form">
                    <form onSubmit={this.submitInvoiceName} style={{display: inputNameForm}}>
                        <input
                            type="text"
                            onChange={this.handleInputInvoiceName}
                            value={inputInvoiceName}
                            placeholder="Input Invoice Name"
                            className="input-invoice-name"
                        />
                    </form>

                    <h1 className="title"
                        style={{display: viewName}}
                        onClick={e => this.editName(e)}
                    >
                        {invoiceName}
                    </h1>
                </div>

                <fieldset className="form-fieldset">
                    <legend>Detail</legend>

                    <form onSubmit={this.submitForm}>
                        <input
                            type="text"
                            onChange={this.handleInputName}
                            value={inputName}
                            placeholder="Input Detail"
                        />

                        <input
                            type="number"
                            onChange={this.handleInputPrice}
                            value={inputPrice}
                            placeholder="Input Price"
                        />

                        <button type="submit"> Add</button>
                    </form>
                </fieldset>

                <div className="table-container">
                    <table className="invoice-detail">
                        <thead>
                        <tr>
                            <th style={{width: 40}} className="text-center" rowSpan={2}>No</th>
                            <th className="text-left padLeft" rowSpan={2}>Name</th>
                            <th className="text-right padRight" rowSpan={2}> Price</th>
                            <th colSpan={participantList.length}> Participants</th>
                            <th className="text-center" style={{width: 70}} rowSpan={2}>Action</th>
                        </tr>
                        <tr>
                            {participantName}
                        </tr>
                        </thead>

                        <tbody>
                        {detailsRender}
                        </tbody>

                        <tfoot>
                        <tr>
                            <td colSpan={2} className="padLeft">Total</td>
                            <td className="text-right padRight number-spacing">{total}</td>
                        </tr>
                        <tr>
                            <td className="padLeft">Service</td>
                            <td className="text-right">
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
                            <td className="text-right padRight number-spacing">{serviceCharge}</td>
                        </tr>
                        <tr>
                            <td className="padLeft">Tax</td>
                            <td className="text-right padRight number-spacing">10%</td>
                            <td className="text-right padRight number-spacing">{tax}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="padLeft">Grand Total</td>
                            <td className="text-right padRight number-spacing">{grandTotal}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="text-center">
                    <button>
                        Save
                    </button>
                    <button>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

export default Invoice;