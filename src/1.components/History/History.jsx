import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { urlApi } from '../../2.helpers/database'
import { Redirect, Link } from 'react-router-dom'
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBBadge, MDBListGroupItem, MDBListGroup }
from 'mdbreact'


class History extends Component {
    state = {
        hisData : [],
        editMode: false,
        editItem: null,
        tgl: '',
        penerima: '',
        alamat: '',
        kodepos: ''
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
                <tr className='text-center'>
                    <th scope='row'>
                        <p className='mt-2'>{idx + 1}</p>
                    </th>
                    <td>
                        <p className='mt-2'>{realDate}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.items.length}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.totalPrice)}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.totalPay)}</p>
                    </td>
                    <td className='text-center'>
                        <MDBBtn color='indigo' className='white-text' onClick={() => this.setState({ editMode: true, editItem: val.items, penerima: val.recipient, alamat: val.address, kodepos: val.zipcode, tgl: realDate  })}>
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
                <tr className='text-center'>
                    <th scope='row'>
                        <img src={val.img} alt="Item" height='50px' />
                    </th>
                    <td>
                        <p className='mt-2'>{val.productName}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.price - (val.price * (val.discount / 100)))}</p>
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
                            Details <span className='font-small'>({this.state.tgl})</span>
                        </MDBModalHeader>
                        <MDBModalBody className='p-4'>
                            <MDBListGroup className='mb-4'>
                                <MDBListGroupItem><strong>Recipient :</strong> &nbsp;{this.state.penerima}</MDBListGroupItem>
                                <MDBListGroupItem><strong>Address &nbsp;&nbsp;&nbsp;:</strong> &nbsp;{this.state.alamat}</MDBListGroupItem>
                                <MDBListGroupItem><strong>Postal Code &nbsp;:</strong> &nbsp;{this.state.kodepos}</MDBListGroupItem>
                            </MDBListGroup>

                            <MDBTable hover responsive>
                                <MDBTableHead color='dark'>
                                    <tr className='text-center'>
                                        <th>Img</th>
                                        <th>Item</th>
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
                        <tr className='text-center'>
                            <th>#</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Total Pay</th>
                            <th>Action</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                            this.state.hisData.length > 0
                                ?
                                this.renderHistory()
                                :
                                <td className='text-center badge-danger' colSpan='6'>
                                    You have no shopping history.
                                    <Link to='/'>
                                        <MDBBtn color='deep-orange' className='ml-3 white-text'>Go Shopping</MDBBtn>
                                    </Link>
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