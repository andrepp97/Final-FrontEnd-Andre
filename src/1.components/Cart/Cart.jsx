import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {urlApi} from '../../2.helpers/database'
import { Redirect } from 'react-router-dom'
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBIcon, MDBTooltip, MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow, MDBInput }
from 'mdbreact'
import { ToastContainer, toast } from 'react-toastify'
import { getCartQty } from '../../redux/1.actions'


class Cart extends Component {
    state = {
        cartData : [],
        isCheckout: false,
        contentPerPage: 3,
        page: 0,
        penerima: '',
        alamat: '',
        pos: '',
        totalPay: 0,
        nameError: '',
        alamatError: '',
        posError: ''
    }

    componentDidUpdate(){
        this.props.getCartQty(this.props.id)
    }

    componentWillReceiveProps(newProps){
        this.getDataCart(newProps.id)
    }

    componentDidMount(){
        this.getDataCart(this.props.id)
    }

    getDataCart = (id) => {
        Axios.get(urlApi + 'Cart?userId=' + id)
        .then(res => {
            this.setState({
                cartData : res.data
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    deleteItem = (idBro) => {
        Axios.delete(urlApi + 'Cart/' + idBro)
            .then((res) => {
                this.getDataCart(this.props.id)
                toast.error('Item deleted')
            })
            .catch((err) => {
                console.log(err)
            })
    }
    
    renderCart = () => {
        var showData = this.state.cartData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage)
        var jsx = showData.map((val,idx) => {
            return (
                <tr>
                    <th scope='row'>
                        <p className='mt-2'>{val.productName}</p>
                    </th>
                    <td><img src={val.img} alt="gambar" width="60px" height="60px" /></td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.price - (val.price * (val.discount / 100)))}</p>
                    </td>
                    <td className='d-flex justify-content-center'><div className="btn-group">
                        <MDBBtn className='white-text mr-1' color='deep-orange' onClick={() => this.onBtnEditQty('min', idx, val.id)}>-</MDBBtn>
                        <MDBBtn color='none'>{val.quantity}</MDBBtn>
                        <MDBBtn className='white-text ml-1' color='deep-orange' onClick={() => this.onBtnEditQty('add', idx)}>+</MDBBtn>
                    </div></td>
                    <td>
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format((val.price - (val.price * (val.discount / 100))) * val.quantity)}</p>
                    </td>
                    <td className='text-center'>
                        <MDBTooltip placement="left">
                            <MDBBtn onClick={() => this.deleteItem(val.id)} color='red' className='white-text'><MDBIcon icon="trash-alt" /></MDBBtn>
                            <div>Delete</div>
                        </MDBTooltip>
                    </td>
                </tr>
            )
        })

        return jsx
    }

    onBtnEditQty = (action, idx, id) => {
        let arrCart = this.state.cartData

        if (action === 'min') {
            if (arrCart[idx].quantity > 1) {
                arrCart[idx].quantity -= 1
                Axios.put(urlApi + 'cart/' + arrCart[idx].id, arrCart[idx])
                    .then(res => this.getDataCart(this.props.id))
                    .catch(err => console.log(err))
            }else if (arrCart[idx].quantity === 1) {
                Axios.delete(urlApi + 'Cart/' + id)
                    .then((res) => {
                        this.getDataCart(this.props.id)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        } else if (action === 'add') {
            arrCart[idx].quantity += 1
            Axios.put(urlApi + 'cart/' + arrCart[idx].id, arrCart[idx])
                .then(res => this.getDataCart(this.props.id))
                .catch(err => console.log(err))
        }
    }

    totBayar = () => {
        var tot = 0
        this.state.cartData.map((val) => {
            return tot += (val.price - (val.price * (val.discount / 100))) * val.quantity
        })
        return tot
    }

    validateInput = () => {
        let nameError = ''
        let alamatError = ''
        let posError = ''

        if (this.state.penerima === '') {
            nameError = `Recipient can't be empty`
        }

        if (this.state.alamat === '') {
            alamatError = 'Please fill the address'
        }

        if (this.state.pos === '') {
            posError = 'ZIP Code is a must'
        }

        if (nameError || posError || alamatError) {
            this.setState({
                nameError,
                alamatError,
                posError
            })
            return false
        }

        return true
    }

    bayar = () => {
        const isValid = this.validateInput()

        if (isValid) {
            let totalPrice = this.totBayar()
            let d = new Date()
            let today = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
            let items = this.state.cartData
            let newData = {
                userId : this.props.id,
                items,
                time : today,
                totalPrice,
                recipient : this.state.penerima,
                address : this.state.alamat,
                zipcode : this.state.pos,
                totalPay : this.state.totalPay
            }

            if (totalPrice > this.state.totalPay) {
                toast.error(`Maaf! Uang anda kurang Rp ${new Intl.NumberFormat('id-ID').format(totalPrice - this.state.totalPay)}`)
            } else if (this.state.totalPay > totalPrice) {
                toast.success(`Terima kasih! Kembalian anda Rp ${new Intl.NumberFormat('id-ID').format(this.state.totalPay - totalPrice)}`)
                Axios.post(urlApi + 'history/', newData)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                
                for (let i = 0; i < this.state.cartData.length; i++) {
                    Axios.delete(urlApi + 'Cart/' + this.state.cartData[i].id)
                    .then(res => {
                        console.log(res)
                        this.setState({cartData:[]})
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
                this.setState({ isCheckout: !this.state.isCheckout })
            } else {
                toast.success('Terima kasih telah membayar dengan uang pas!')
                Axios.post(urlApi + 'history/', newData)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })

                for (let i = 0; i < this.state.cartData.length; i++) {
                    Axios.delete(urlApi + 'Cart/' + this.state.cartData[i].id)
                        .then(res => {
                            console.log(res)
                            this.setState({ cartData: [] })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                this.setState({isCheckout:!this.state.isCheckout})
            }
        }
    }


    render() {
        if (this.props.role === '')
            return <Redirect to="/" />

        return (
            <div className="container">
                {/*TOAST*/}
                <div>
                    <ToastContainer position="top-center" closeOnClick autoClose={3000} />
                </div>
                
                <div className='mt-5'>&nbsp;</div>
                <h2 className='text-center mt-5 pb-3 border-bottom'>My Cart</h2>
                <div className="row">
                    <div className="col-lg-8">
                        <MDBTable hover responsive className="mt-4">
                            <MDBTableHead color='dark'>
                                <tr>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th className='text-center'>Quantity</th>
                                    <th>Total Price</th>
                                    <th className='text-center'>Action</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {
                                    this.state.cartData.length > 0
                                        ?
                                        this.renderCart()
                                        :
                                        <td className='text-center badge-danger' colSpan='6'>There is no item in your cart</td>
                                }
                            </MDBTableBody>
                        </MDBTable>

                        {/* PAGINATION */}
                        <div className="card-footer">
                            <MDBRow>
                                <MDBCol className='d-flex justify-content-center'>
                                    <MDBPagination className='mt-2'>
                                        {
                                            this.state.page < 1
                                                ?
                                                <MDBPageItem disabled>
                                                    <MDBPageNav aria-label="Previous">
                                                        <span aria-hidden="true">Previous</span>
                                                    </MDBPageNav>
                                                </MDBPageItem>
                                                :
                                                <MDBPageItem>
                                                    <MDBPageNav onClick={() => this.setState({ page: this.state.page - 1 })} aria-label="Previous">
                                                        <span aria-hidden="true">Previous</span>
                                                    </MDBPageNav>
                                                </MDBPageItem>
                                        }

                                        <MDBPageItem>
                                            {
                                                this.state.page < 1
                                                    ?
                                                    null
                                                    :
                                                    <MDBPageNav onClick={() => this.setState({ page: this.state.page - 1 })}>
                                                        <span>{this.state.page}</span>
                                                    </MDBPageNav>
                                            }

                                        </MDBPageItem>

                                        <MDBPageItem active>
                                            <MDBPageNav style={{ background: '#343A40' }}>
                                                {this.state.page + 1} <span className="sr-only">(current)</span>
                                            </MDBPageNav>
                                        </MDBPageItem>

                                        <MDBPageItem>
                                            {
                                                this.state.cartData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage).length < 3 || this.state.cartData.length / (this.state.page + 1) === this.state.contentPerPage
                                                    ?
                                                    null
                                                    :
                                                    <MDBPageNav onClick={() => this.setState({ page: this.state.page + 1 })}>{this.state.page + 2}</MDBPageNav>
                                            }
                                        </MDBPageItem>

                                        {
                                            this.state.cartData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage).length < 3 || this.state.cartData.length / (this.state.page + 1) === this.state.contentPerPage
                                                ?
                                                <MDBPageItem disabled>
                                                    <MDBPageNav aria-label="Previous">
                                                        <span aria-hidden="true">Next</span>
                                                    </MDBPageNav>
                                                </MDBPageItem>
                                                :
                                                <MDBPageItem>
                                                    <MDBPageNav onClick={() => this.setState({ page: this.state.page + 1 })} aria-label="Previous">
                                                        <span aria-hidden="true">Next</span>
                                                    </MDBPageNav>
                                                </MDBPageItem>
                                        }
                                    </MDBPagination>
                                </MDBCol>
                            </MDBRow>
                        </div>
                        {/* PAGINATION END */}
                    </div>

                    <div className="col-lg-4">
                        {/* CHECKOUT */}
                        <div className="card mt-4">
                            <div className="card-header">
                                <h5 className='text-center'>Shopping Summary</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        Total
                                    </div>
                                    <div className="col-md-8 text-right">
                                        <strong style={{ letterSpacing: '1px' }}>Rp {new Intl.NumberFormat('id-ID').format(this.totBayar())}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer px-5">
                                {
                                    this.state.cartData.length > 0
                                    ?
                                        <MDBBtn color='deep-orange' onClick={() => this.setState({ isCheckout: !this.state.isCheckout })} className='btn-block white-text'>{this.state.isCheckout ? <><MDBIcon icon="times" /><span> Cancel</span></> : <><MDBIcon icon="shopping-cart" /><span> Checkout</span></>}</MDBBtn>
                                    :
                                        <Link to='/' className='text-decoration-none'>
                                            <MDBBtn color='deep-orange' className='btn-block white-text'>Go Shopping</MDBBtn>
                                        </Link>
                                }
                            </div>
                        </div>
                        {
                            this.state.isCheckout
                            ?
                                <div className="card mt-3">
                                    <div className="card-header">
                                        <h5 className='text-center'>Details</h5>
                                    </div>
                                    <div className="col-md-12">
                                        <MDBInput outline label='Recipient Name' onChange={(e) => this.setState({ penerima: e.target.value })}></MDBInput>
                                        <p style={{fontSize:'70%', color:'red', marginTop:'-20px'}}>{this.state.nameError}</p>
                                    </div>
                                    <div className="col-md-12 mt-n2">
                                        <MDBInput outline type='textarea' label='Address' onChange={(e) => this.setState({ alamat: e.target.value })} className='border rounded' maxLength='100' style={{ resize: 'none' }}></MDBInput>
                                        <p style={{ fontSize: '70%', color: 'red', marginTop: '-20px' }}>{this.state.alamatError}</p>
                                    </div>
                                    <div className="col-md-12 mt-n2 mb-4">
                                        <MDBInput outline label='Zip Code' onChange={(e) => this.setState({ pos: e.target.value })}></MDBInput>
                                        <p style={{ fontSize: '70%', color: 'red', marginTop: '-20px' }}>{this.state.posError}</p>
                                    </div>
                                    <div className="card-footer">
                                        <div className="col-md-12">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">Rp</span>
                                                </div>
                                                <input type="number" step='10000' className="form-control border rounded pl-3" placeholder=" Your Money . . ." onChange={(e) => this.setState({ totalPay: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-md-12 mb-3 px-5">
                                            <MDBBtn color='deep-orange' className='btn-block white-text' onClick={this.bayar}><MDBIcon icon="money-bill" /> Pay</MDBBtn>
                                        </div>
                                    </div>
                                </div>
                            : null
                        }
                    </div>

                </div>
                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        id : state.user.id,
        username : state.user.username,
        role: state.user.role,
        cartUser : state.cart.cartLength
    }
}

export default connect(mapStateToProps, {getCartQty})(Cart)