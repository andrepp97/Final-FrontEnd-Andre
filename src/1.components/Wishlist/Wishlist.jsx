import React, { Component } from 'react'
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBIcon, MDBTooltip} from 'mdbreact'
import { Redirect, Link } from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { urlApi } from '../../2.helpers/database'
import { ToastContainer, toast } from 'react-toastify'


class Wishlist extends Component {
    state = {
        wishData : []
    }

    componentDidMount() {
        this.getDataWish(this.props.id)
    }

    getDataWish = (id) => {
        Axios.get(urlApi + 'wishlist?userId=' + id)
            .then(res => {
                this.setState({
                    wishData: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderWish = () => {
        var jsx = this.state.wishData.map((val, idx) => {
            return (
                <tr className='text-center'>
                    <th scope='row'>
                        <p className='mt-3'>{idx + 1}</p>
                    </th>
                    <td>
                        <Link to={"/product-details/" + val.productId}>
                            <img src={val.img} alt="product img" height='60px' />
                        </Link>
                    </td>
                    <td>
                        <Link to={"/product-details/" + val.productId} className='text-decoration-none'>
                            <h6 className='mt-3'>{val.productName}</h6>
                        </Link>
                    </td>
                    <td className='text-center'>
                        <MDBTooltip placement="left">
                            <MDBBtn color='red' className='white-text' onClick={() => this.deleteItem(val.id)}>
                                <MDBIcon icon="trash-alt" />
                            </MDBBtn>
                            <div>Delete</div>
                        </MDBTooltip>
                    </td>
                </tr>
            )
        })

        return jsx
    }

    deleteItem = (idBro) => {
        Axios.delete(urlApi + 'wishlist/' + idBro)
            .then((res) => {
                this.getDataWish(this.props.id)
                toast.error('Item deleted')
            })
            .catch((err) => {
                console.log(err)
            })
    }


    render() {
        if (this.props.userObj.role === '')
            return <Redirect to="/" />

        return (
            <div className='container'>
                {/*TOAST*/}
                <div>
                    <ToastContainer position="top-center" closeOnClick autoClose={2500} />
                </div>
                <div className="my-5">&nbsp;</div>
                <h2 className='text-center border-bottom pb-3'>My Wishlist</h2>
                <MDBTable hover responsive className="mt-4">
                    <MDBTableHead color='dark'>
                        <tr className='text-center'>
                            <th>#</th>
                            <th>Img</th>
                            <th>Item Name</th>
                            <th>Action</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                            this.state.wishData.length > 0
                                ?
                                this.renderWish()
                                :
                                <td className='text-center badge-danger' colSpan='6'>
                                    Nothing in wishlist.
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

export default connect(mapStateToProps)(Wishlist)