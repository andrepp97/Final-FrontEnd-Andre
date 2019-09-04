import React, { Component } from 'react';
import { MDBInput, MDBBtn } from "mdbreact";
import ProductBox from '../General/ProductBox'
import Carousel from "../General/Carousel";
import Axios from 'axios';
import {urlApi} from '../../2.helpers/database'
import swal from "sweetalert"
import { connect } from 'react-redux'
import { getCartQty } from '../../redux/1.actions'


class Home extends Component {
    state = {
        productData: []
    }

    componentDidMount() {
        this.getDataProducts()
        this.props.getCartQty(this.props.id)
    }

    getDataProducts = () => {
        Axios.get(urlApi + 'products')
        .then((res) => {
            this.setState({productData : res.data})
        })
        .catch((err) => {
            console.log(err)
            swal('ERROR', 'Can not retrieve data','error')
        })
    }
    
    renderProducts = () => {
        let jsx = this.state.productData.map(val => {
            return(
                <ProductBox cartQty={this.props.getCartQty} userId={this.props.id} id={val.id} nama={val.nama} harga={val.harga} discount={val.discount} img={val.img} deskripsi={val.deskripsi} />
            )
        })
        return jsx
    }


    render() {
        return (
            <div className="container">
                <div className="row mt-5">&nbsp;</div>
                <div className="row mt-5">
                    <div className="col-lg-3 mt-4 mb-3">
                        <div className="input-group mb-3 ml-1">
                            <input type="search" ref="searchBox" className="form-control" style={{background:'#f2f2f2', marginTop:'5.5px', marginLeft:'0vh'}} placeholder="Type to search . . ." />
                            <div className="input-group-append">
                                <MDBBtn color='deep-orange'><i className="fas fa-search white-text" /></MDBBtn>
                            </div>
                        </div>

                        <div className="card pl-3 pr-3 pb-2">
                            <form ref="formFilter">
                                <MDBInput outline label="Cari produk" />

                                <MDBInput outline label="Cari toko" />

                                <MDBInput outline label="Cari user" />

                                <MDBBtn style={{color:'white'}} className='btn-block mb-3' color="deep-orange">filter</MDBBtn>
                            </form>
                        </div>
                    </div>

                    {/* Carousel */}
                <div className="col-lg-9">
                    <Carousel />
                </div>
                </div>


                <div className="container mt-4 text-center">
                    <h2>ALL PRODUCTS</h2>
                    <div className="row d-flex justify-content-center">
                        {this.renderProducts()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        id: state.user.id,
        cartUser: state.cart.cartLength
    }
}

export default connect(mapStateToProps,{ getCartQty })(Home)