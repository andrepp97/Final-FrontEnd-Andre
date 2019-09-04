import React from 'react';
import {Link} from 'react-router-dom'
import { MDBBtn } from 'mdbreact'
import Axios from 'axios'
import { urlApi } from '../../2.helpers/database'
import { getCartQty } from '../../redux/1.actions'
import { connect } from 'react-redux'
import swal from 'sweetalert'


const ProductBox = (props) => {

    const addToCart = () => {
        let cartObj = {
            productId: props.id,
            userId: props.userId,
            quantity: 1,
            price: props.harga,
            img: props.img,
            discount: props.discount,
            productName: props.nama
        }

        Axios.get(urlApi + `cart?userId=${props.userId}&productId=${props.id}`)
            .then((res) => {
                if (res.data.length > 0) {
                    cartObj.quantity = parseInt(res.data[0].quantity) + 1
                    Axios.put(urlApi + 'cart/' + res.data[0].id, cartObj)
                        .then((res) => {
                            swal('Success','Item added to cart', 'success')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    Axios.post(urlApi + 'cart', cartObj)
                        .then((res) => {
                            swal('Success', 'Item added to cart', 'success')
                            props.cartQty(props.userId)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
            .catch((err) => {
                alert(err)
            })
    }

    return (
        <div className='card col-md-3 m-3' style={{ width: '18rem' }}>
            <Link className='linkProduk rounded' to={"/product-details/" + props.id}>
                <img className="card-img-top img" height='240px' src={props.img} alt='productImage'></img>
            </Link>
            {
                props.discount > 0
                ?
                <div className="diskon">{props.discount}% off</div>
                :
                null
            }
            <div className="card-body">
                <Link className='linkProduk' to={"/product-details/" + props.id}>
                    <h4 className='card-text mb-2'><strong>{props.nama}</strong></h4>
                </Link>
                {
                    props.discount > 0
                    ?
                        <p style={{textDecoration:'line-through', color:'orangered'}} className='card-text mb-auto'>Rp {new Intl.NumberFormat('id-ID').format(props.harga)}</p>
                    :
                        null
                }
                <p className='card-text'>Rp {new Intl.NumberFormat('id-ID').format(props.harga - (props.harga * props.discount / 100))}</p>
            </div>
            
            <div className="card-footer" style={{backgroundColor:'transparent'}}>
                {
                    props.userId === 0
                    ?
                        <Link to='/Login' style={{textDecoration:'none'}}>
                            <MDBBtn color='deep-orange' className='btn-block white-text'>Login</MDBBtn>
                        </Link>
                    :
                    <>
                        {
                            props.userId === 1
                            ?
                            <Link to='/adminDashboard' style={{textDecoration:'none'}}>
                                <MDBBtn color='indigo' className='btn-block white-text'>Manage</MDBBtn>
                            </Link>
                            :
                            <MDBBtn color='deep-orange' className='btn-block white-text' onClick={addToCart}>Buy</MDBBtn>
                        }
                    </>
                }
            </div>
        </div>
    );
};

export default connect(null, { getCartQty })(ProductBox)