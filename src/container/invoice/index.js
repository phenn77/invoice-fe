import React, {Component} from 'react';
import './style.css';

class Invoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantList: this.props.participantList,
            participantChecked: [], //contain each participant data on each invoice detail by clicked checkbox
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
            eachAmount: [], //assign each price to each checkbox
            eachTotal: {},
            eachService: {},
            eachTax: {},
            eachGrandTotal: {},
            highSpender: {},
            highestAmount: 0
        };

        this.submitInvoiceName = this.submitInvoiceName.bind(this);
        this.handleInputInvoiceName = this.handleInputInvoiceName.bind(this);
        this.editName = this.editName.bind(this);

        this.submitForm = this.submitForm.bind(this);
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputPrice = this.handleInputPrice.bind(this);
        this.handleInputServiceCharge = this.handleInputServiceCharge.bind(this);

        this.resetData = this.resetData.bind(this);

        this.inputChoice = this.inputChoice.bind(this);
    }

    formatNumber(num) {
        return Number(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
        const servCharge = e.target.value;
        const totalPrice = this.state.total;

        const serviceChargeAmount = totalPrice * (servCharge / 100);

        const totalPlusService = totalPrice + serviceChargeAmount;

        const taxAmount = totalPlusService * 0.1;

        const grandTotal = totalPlusService + taxAmount;

        this.setState({
            serviceCharge: Math.round(serviceChargeAmount),
            tax: Math.round(taxAmount),
            grandTotal: Math.round(grandTotal),
            inputService: servCharge
        }, () => {
            this.setMustPay();
        })
    }

    deleteDetail(e, index, price) {
        const {details, total} = this.state;

        const newDetails = details;
        newDetails.splice(index, 1);

        this.setState({
            details: newDetails,
            total: total - price
        }, () => {
            if (newDetails.length === 0) {
                this.resetData(e);
            }
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

    resetData(e) {
        e.preventDefault();

        this.setState({
            total: 0,
            serviceCharge: 0,
            tax: 0,
            grandTotal: 0,
            inputService: 0,
            details: [],
            eachAmount: [],
            participantChecked: [],
            eachTotal: {},
            eachService: {},
            eachTax: {},
            eachGrandTotal: {}
        })
    }

    //handle the checkbox to split price by each participant
    inputChoice(e, name, price, participant, index, isDeleting) {

        let {eachAmount, participantChecked} = this.state;

        if (isDeleting) {
            const idx = participantChecked[index].indexOf(participant);
            participantChecked[index].splice(idx, 1);
        } else {
            if (typeof participantChecked[index] !== "object") {
                participantChecked[index] = [];
            }

            participantChecked[index].push(participant);
        }

        eachAmount[index] = Math.round(price / (participantChecked[index].length || 1));


        this.setState({
            eachAmount,
            participantChecked,

        }, () => {
            this.setMustPay();
        });
    };
    //handle the checkbox to split price by each participant

    //count all the participants amount
    setMustPay = () => {
        const {
            eachAmount,
            participantChecked,
            inputService,
            highSpender
        } = this.state;

        let eachTotal = {};
        let eachService = {};
        let eachTax = {};
        let mustPay = {}; //Grand Total

        participantChecked.map((value, index) => {
            value = [...new Set(value)];

            value.forEach((name) => {
                if (mustPay[name] === undefined || eachTotal[name] === undefined ||
                    eachService[name] === undefined || eachTax[name] === undefined) {
                    mustPay[name] = 0;
                    eachTotal[name] = 0;
                    eachService[name] = 0;
                    eachTax[name] = 0;
                }

                mustPay[name] = mustPay[name] + eachAmount[index]; //Grand Total

                eachTotal[name] = eachTotal[name] + eachAmount[index];
            });

        });

        if (inputService > 0) {
            Object.keys(mustPay).forEach(name => {

                //Each Service Amount
                eachService[name] = eachTotal[name] * inputService / 100;
                //Each Service Amount

                //Each Tax Amount
                eachTax[name] = (eachTotal[name] + eachService[name]) * 0.1;
                //Each Tax Amount

                //Grand Total
                mustPay[name] = mustPay[name] + (mustPay[name] * inputService / 100);
                mustPay[name] = mustPay[name] + (mustPay[name] * 0.1);
                //Grand Total
            });

            //get the highest amount
            const highestNum = Math.round(Math.max(...Object.values(mustPay)));

            Object.entries(mustPay).forEach(
                ([name, price]) => {
                    name = [...new Set(name)];

                    if(price === highestNum) {
                        highSpender[price] = name;
                    }
                }
            );
        }

        this.setState({
            eachTotal,
            eachService,
            eachTax,
            eachGrandTotal: mustPay
        });
    };
    //count all the participants amount

    render() {
        const {
            inputInvoiceName, inputName, inputPrice,
            details, total, serviceCharge, inputService, tax, grandTotal,
            invoiceName, viewName, inputNameForm,
            eachService,
            eachTax,
            eachTotal,
            eachGrandTotal
        } = this.state;

        const {participantList} = this.props;

        const participantName = participantList.map((value) => {
            return (
                <th style={{width: 200}}>
                    {value}
                </th>
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
                        {details.map((value, index) => {
                            return (
                                <tr>
                                    <td className="text-center">
                                        {index + 1}
                                    </td>
                                    <td className="padLeft">
                                        {value.name}
                                    </td>
                                    <td className="numberStyle">
                                        {this.formatNumber(value.price)}
                                    </td>

                                    {
                                        participantList.map((name) => {
                                            const checked = (this.state.participantChecked[index] || []).indexOf(name) > -1;

                                            return (
                                                <td>
                                                    <form>
                                                        <input
                                                            type="checkbox"
                                                            onChange={e => this.inputChoice(e, value.name, value.price, name, index, checked)}
                                                            checked={checked}
                                                            style={{float: 'left'}}
                                                        />

                                                        <span className="floatRight numberStyle">
                                                        {checked ? this.formatNumber(Math.round(this.state.eachAmount[index])) : 0}
                                                        </span>
                                                    </form>
                                                </td>
                                            );
                                        })
                                    }

                                    <td className="text-center">
                                        <button
                                            type="button"
                                            onClick={e => this.deleteDetail(e, index, value.price)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>

                        <tfoot>
                        <tr>
                            <td colSpan={2} className="padLeft">Total</td>
                            <td className="numberStyle">{this.formatNumber(total)}</td>
                            {participantList.map(name => {
                                return (
                                    <td key={name} className="numberStyle">
                                        {this.formatNumber(Math.round(eachTotal[name] || 0))}
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="padLeft">Service</td>
                            <td className="text-right">
                                <input
                                    type="number"
                                    onChange={this.handleInputServiceCharge}
                                    value={inputService}
                                    step="0.5"
                                    min="0"
                                    max="15"
                                />
                            </td>
                            <td className="numberStyle">{this.formatNumber(serviceCharge)}</td>
                            {participantList.map(name => {
                                return (
                                    <td key={name} className="numberStyle">
                                        {this.formatNumber(Math.round(eachService[name] || 0))}
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="padLeft">Tax</td>
                            <td className="numberStyle">10%</td>
                            <td className="numberStyle">{this.formatNumber(tax)}</td>
                            {participantList.map(name => {
                                return (
                                    <td key={name} className="numberStyle">
                                        {this.formatNumber(Math.round(eachTax[name] || 0))}
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td colSpan={2} className="padLeft">Grand Total</td>
                            <td className="numberStyle">{this.formatNumber(grandTotal)}</td>
                            {participantList.map(name => {
                                return (
                                    <td key={name} className="numberStyle">
                                        {this.formatNumber(Math.round(eachGrandTotal[name] || 0))}
                                    </td>
                                )
                            })}
                        </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="text-center">
                    <button onClick={e => this.resetData(e)}>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

export default Invoice;