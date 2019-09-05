import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { urlApi } from '../../2.helpers/database'
import { Redirect } from 'react-router-dom'
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBBadge }
from 'mdbreact'


class History extends Component {
    state = {
        hisData : [],
        editMode: false,
        editItem: null
    }

    componentWillReceiveProps(newProps) {
        this.getDataHis(newProps.id)
    }

    componentDidMount() {
        this.getDataHis(this.props.id)
    }

    getDataHis = (id) => {
        Axios.get(urlApi + 'history?userId=' + id)
            .then(res => {
                this.setState({
                    hisData: res.data
                })
                console.log(this.state.hisData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderHistory = () => {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let monthNumb = 0
        let realDate = ''

        var jsx = this.state.hisData.map((val, idx) => {
            monthNumb = val.time.split('-')[1]
            realDate = val.time.split('-')[2] + ' ' + monthNames[monthNumb - 1] + ' ' + val.time.split('-')[0]
            return (
                <tr>
                    <th scope='row'>
                        <p className='mt-2'>{realDate}</p>
                    </th>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.totalPrice)}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.recipient}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.address}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.zipcode}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.totalPay)}</p>
                    </td>
                    <td className='text-center'>
                        <MDBBtn color='indigo' className='white-text' onClick={() => this.setState({ editMode: true, editItem: val.items })}>
                            Details
                        </MDBBtn>
                    </td>
                </tr>
            )
        })
        return jsx
    }

    getDetails = () => {
        let silit = this.state.editItem.map((val, idx) => {
            return(
                <tr>
                    <th scope='row'>
                        <img src={val.img} alt="Item" height='50px' />
                    </th>
                    <td>
                        <p className='mt-2'>{val.productName}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.price)}</p>
                    </td>
                    <td>
                        <MDBBadge style={{fontSize:'12px'}} color='deep-orange' className='text-center rounded-circle mt-2'>{val.quantity}</MDBBadge>
                    </td>
                </tr>
            )
        })
        return silit
    }


    
    render() {
        if (this.props.userObj.role === '')
            return <Redirect to="/" />

        return (
            <div className='container'>
                {/* Modal */}
                {this.state.editMode ?
                    <MDBModal isOpen={this.state.editMode} centered>
                        <MDBModalHeader toggle={() => this.setState({ editMode: false, editItem: null })}>
                            Detail Pesanan
                        </MDBModalHeader>
                        <MDBModalBody className='p-4'>
                            <MDBTable hover responsive>
                                <MDBTableHead color='dark'>
                                    <tr>
                                        <th colSpan='2' className='text-center'>Items</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {this.getDetails()}
                                </MDBTableBody>
                            </MDBTable>
                        </MDBModalBody>
                    </MDBModal> : null}

                <div className='my-5'>&nbsp;</div>
                <h2 className='text-center border-bottom pb-3'>Shopping History</h2>
                <MDBTable hover responsive className="mt-4">
                    <MDBTableHead color='dark'>
                        <tr>
                            <th>Date</th>
                            <th>Total Price</th>
                            <th>Recipient</th>
                            <th>Address</th>
                            <th>ZIP Code</th>
                            <th>Total Pay</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                            this.state.hisData.length > 0
                                ?
                                this.renderHistory()
                                :
                                <td className='text-center badge-danger' colSpan='7'>
                                    You have no shopping history
                                </td>
                        }
                    </MDBTableBody>
                </MDBTable>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: state.user.id,
        userObj: state.user
    }
}

export default connect(mapStateToProps)(History)