import React, { Component } from 'react';
import Axios from 'axios'
import { urlApi } from '../../2.helpers/database'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { MDBIcon, MDBInput, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBTooltip } from 'mdbreact'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer, toast } from 'react-toastify'
import { getCartQty } from '../../redux/1.actions'


class ProductDetails extends Component {

    state = {
        product : {},
        wishlist : false,
        qtyInput : 1
    }
    

    componentDidMount(){
        this.getProductDetails()
    }

    getProductDetails = () => {
        Axios.get(urlApi + 'products/' + this.props.match.params.id)
        .then((res) => {
            console.log(res)
            this.setState({product : res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    addToCart = () => {
        let cartObj = {
            productId : this.state.product.id,
            userId : this.props.id,
            quantity : parseInt(this.state.qtyInput),
            price : this.state.product.harga,
            img : this.state.product.img,
            discount : this.state.product.discount,
            productName : this.state.product.nama
        }
        
        Axios.get(urlApi + `cart?userId=${this.props.id}&productId=${this.state.product.id}`)
        .then((res) => {
            if(res.data.length > 0){
                cartObj.quantity = parseInt(res.data[0].quantity) + parseInt(this.state.qtyInput)
                Axios.put(urlApi + 'cart/' + res.data[0].id, cartObj)
                .then((res) => {
                    toast.success('Item added to cart!')
                })
                .catch((err) => {
                    console.log(err)
                })
            }else{
                Axios.post(urlApi + 'cart', cartObj)
                .then((res) => {
                    toast.success('Item added to cart!')
                    this.props.getCartQty(this.props.id)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        })
        .catch((err) => {
            alert('ERROR', 'Server error, try again later', 'error')
        })
    }


    render() {
        var {nama, harga, discount, deskripsi, img} = this.state.product
        
        return (
            <div className='container'>
                {/*TOAST*/}
                <div>
                    <ToastContainer position="top-center" closeOnClick autoClose={3000} />
                </div>
                <div className='mt-5'>&nbsp;</div>
                <div>&nbsp;</div>

                <div className="row mt-5">
                    <div className='col-md-4 mb-3'>
                        <div className="card imgCuk" style={{width: '100%'}}>
                            <img className="card-img-top" src={img} alt="Product" />
                        </div>
                    </div>

                    <div className='col-md-8'>
                        <h1 style={{ color: '#4c4b4b' }}>{nama}</h1>

                        {
                            discount > 0
                            ?
                                <>
                                <div className="badge badge-danger">
                                    {discount}%
                                </div>
                                <span style={{fontSize:'14px',
                                            fontWeight:'600',
                                            color:"#606060", 
                                            marginLeft:'10px',
                                            textDecoration: 'line-through'}}>
                                    Rp {new Intl.NumberFormat('id-ID').format(harga)}
                                </span>
                                </>
                            :
                            null
                        }

                        <div style={{fontSize:'24px',
                                    fontWeight:'700',
                                    color:'#FF5722',
                                    marginTop:'20px'}}>
                            Rp {new Intl.NumberFormat('id-ID').format(harga - (harga * (discount/100)))}
                        </div>

                        <div className='row'>
                            <div className='col-md-2'>
                                <MDBInput className='text-center' label='Jumlah' outline type="number" value={this.state.qtyInput} onChange={(e) => this.setState({ qtyInput: e.target.value })} min={1} />
                            </div>
                            <div className='col-md-8'>
                                <MDBInput type='text' label='Catatan Untuk Penjual (Opsional)' outline></MDBInput>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className="col-md-10">
                                <MDBCardBody className='border rounded'>
                                    <MDBCardTitle tag="h6">Description</MDBCardTitle>
                                    <MDBCardText className='dark-grey-text'>
                                        {deskripsi}
                                    </MDBCardText>
                                </MDBCardBody>
                            </div>
                        </div>

                        <div className='row mt-5'>
                            <div className="col-md-8 mb-3">
                                {
                                    this.props.username !== ''
                                    ?
                                    <MDBBtn color='indigo' onClick={this.addToCart} className='btn-block white-text'>Add to Cart</MDBBtn>
                                    :
                                    <>
                                    <Link to="/Login" style={{textDecoration:'none'}}>
                                        <MDBBtn className='btn-block'>Add to Cart</MDBBtn>
                                    </Link>
                                    </>
                                }
                            </div>
                            <div className="col-md-2">
                                {
                                    this.state.wishlist
                                    ?
                                        <MDBTooltip placement="right">
                                            <MDBBtn color='' className='btn-block' onClick={() => this.setState({ wishlist: !this.state.wishlist })}>
                                                <MDBIcon icon="heart" style={{ fontSize: '20px', color: 'red', marginTop: '1px' }} />
                                            </MDBBtn>
                                            <div>Remove from Wishlist</div>
                                        </MDBTooltip>
                                    :
                                        <MDBTooltip placement="right">
                                            <MDBBtn color='dark' className='btn-block' onClick={() => this.setState({ wishlist: !this.state.wishlist })}>
                                                <MDBIcon far icon="heart" style={{fontSize: '20px', color: 'white', marginTop:'1px'}} />
                                            </MDBBtn>
                                            <div>Add to Wishlist</div>
                                        </MDBTooltip>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-3'>&nbsp;</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        username : state.user.username,
        id : state.user.id,
        cartUser: state.cart.cartLength
    }
}

export default connect(mapStateToProps, {getCartQty})(ProductDetails)