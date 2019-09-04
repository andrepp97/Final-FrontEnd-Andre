import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { urlApi } from '../../2.helpers/database'
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdbreact'


class History extends Component {
    state = {
        hisData : []
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
                        <MDBBtn color='indigo' className='white-text'>
                            Details
                        </MDBBtn>
                    </td>
                </tr>
            )
        })
        return jsx
    }

    
    render() {
        return (
            <div className='container'>
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