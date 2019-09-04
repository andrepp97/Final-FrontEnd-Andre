import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from "react-redux"
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { urlApi } from '../../2.helpers/database'
import { MDBModal, MDBModalBody, MDBModalFooter, MDBTooltip, MDBModalHeader, MDBIcon, MDBInput, MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow } from 'mdbreact';


class ManageProduct extends Component {
    state = {
        modal14: false,
        productData: [],
        inputName: '',
        inputPrice: '',
        inputDiscount: 0,
        inputCategory: '',
        inputDesc: '',
        inputImg: '',
        contentPerPage: 3,
        page: 0,
        editMode: false,
        editItem: null
    }

    toggle = nr => () => {
        let modalNumber = 'modal' + nr
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
    }

    componentDidMount() {
        this.getDataProducts()
    }

    getDataProducts = () => {
        Axios.get(urlApi + 'products')
            .then((res) => {
                this.setState({ productData: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderProducts = () => {
        let showData = this.state.productData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage)
        let jsx = showData.map((val, idx) => {
            return (
                <tr>
                    <th scope='row'>
                        <p className='mt-2'>{val.nama}</p>
                    </th>
                    <td >
                        <p className='mt-2'>{new Intl.NumberFormat('id-ID').format(val.harga)}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.discount}%</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.category}</p>
                    </td>
                    <td>
                        <p className='mt-2'>{val.deskripsi}</p>
                    </td>
                    <td><img src={val.img} alt="gambar" width="60px" height="60px" /></td>
                    <td className='text-center d-flex justify-content-center'>
                        <MDBTooltip placement="bottom">
                            <MDBBtn onClick={() => this.setState({ editMode: true, editItem: val })} color='indigo' className='white-text'><MDBIcon icon="pen" /></MDBBtn>
                            <div>Edit</div>
                        </MDBTooltip>
                        <MDBTooltip placement="top">
                            <MDBBtn onClick={() => this.deleteProduct(val.id)} color='red' className='white-text'><MDBIcon icon="trash-alt" /></MDBBtn>
                            <div>Delete</div>
                        </MDBTooltip>
                    </td>
                </tr>
            )
        })
        return jsx
    }

    onBtnAddProduct = () => {
        let { inputCategory, inputDesc, inputDiscount, inputImg, inputName, inputPrice } = this.state
        if (inputCategory && inputDesc && inputDiscount && inputImg && inputName && inputPrice) {
            let newData = {
                nama: this.state.inputName,
                harga: this.state.inputPrice,
                category: this.state.inputCategory,
                discount: this.state.inputDiscount,
                deskripsi: this.state.inputDesc,
                img: this.state.inputImg
            }

            Axios.post(urlApi + 'products', newData)
                .then(res => {
                    this.getDataProducts()
                    this.setState({
                        inputName : '',
                        inputPrice : 0,
                        inputCategory : '',
                        inputDiscount : 0,
                        inputImg : '',
                        inputDesc : ''
                    })
                    swal('Success!', "Product added", 'success')
                })
                .catch((err) => {
                    swal('System Error!', 'Unable to connect to server, try again later', 'error')
                })
        } else {
            swal('Warning', 'All fields need to be filled', 'warning')
        }
    }

    deleteProduct = (idBro) => {
        Axios.delete(urlApi + 'products/' + idBro)
            .then((res) => {
                this.getDataProducts()
                swal('Delete', 'Product deleted', 'success')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    onBtnSaveEdit = () => {
        let newItem = {
            id: this.state.editItem.id,
            nama: this.refs.editName.value ? this.refs.editName.value : this.state.editItem.nama,
            harga: this.refs.editPrice.value ? this.refs.editPrice.value : this.state.editItem.harga,
            category: this.refs.editCategory.value ? this.refs.editCategory.value : this.state.editItem.category,
            discount: this.refs.editDiscount.value ? this.refs.editDiscount.value : this.state.editItem.discount,
            deskripsi: this.refs.editDesc.value ? this.refs.editDesc.value : this.state.editItem.deskripsi,
            img: this.refs.editImg.value ? this.refs.editImg.value : this.state.editItem.img
        }

        Axios.put(urlApi + 'products/' + this.state.editItem.id, newItem)
            .then(res => {
                this.getDataProducts()
                swal('Edit Success', 'Your item has been updated', 'success')
            })
            .catch(err => {
                console.log(err)
                swal('Error', 'Ada masalah bro', 'error')
            })

        this.setState({ editMode: false, editItem: null })
    }


    render() {
        if (this.props.userObj.role !== 'admin') {
            return <Redirect to='/' />
        }

        return (
            <div className="container">
                {/* Modal */}
                {this.state.editMode ?
                    <MDBModal isOpen={this.state.editMode} centered>
                        <MDBModalHeader toggle={() => this.setState({ editMode: false, editItem: null })}>
                            {this.state.editItem.nama}
                        </MDBModalHeader>
                        <MDBModalBody className='p-4'>
                                    <div className="row my-n3">
                                        <div className="col-12">
                                            <MDBInput outline label='Product Name' type="text" ref="editName" value={this.state.editItem.nama} />
                                        </div>
                                    </div>
                                    <div className="row my-n3">
                                        <div className="col-8">
                                            <MDBInput outline label='Price' type="number" ref="editPrice" value={this.state.editItem.harga} />
                                        </div>
                                        <div className="col-4">
                                            <MDBInput outline label='Discount' type="number" ref="editDiscount" value={this.state.editItem.discount} />
                                        </div>
                                    </div>
                                    <div className="row my-n3">
                                        <div className="col-4">
                                            <MDBInput outline label='Category' type="text" ref="editCategory" value={this.state.editItem.category} />
                                        </div>
                                        <div className="col-8">
                                            <MDBInput outline label='Image URL' type="text" ref="editImg" value={this.state.editItem.img} />
                                        </div>
                                    </div>
                                    <div className="row my-n3">
                                        <div className="col-12">
                                            <MDBInput outline label='Description' type="textarea" ref="editDesc" className='border rounded' rows='3' maxLength='200' style={{resize:'none'}} value={this.state.editItem.deskripsi} />
                                        </div>
                                    </div>
                        </MDBModalBody>
                        <MDBModalFooter className='p-4'>
                            <MDBBtn color='indigo' className="btn-block white-text" onClick={this.onBtnSaveEdit}>Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal> : null}

                {/* ADMIN CONTENT */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-body">
                                <MDBTable hover responsive className="mt-5">
                                    <MDBTableHead color='dark'>
                                        <tr>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Image</th>
                                            <th className='text-center'>Action</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {
                                            this.state.productData.length > 0
                                                ?
                                                this.renderProducts()
                                                :
                                                <td className='text-center badge-danger' colSpan='7'>There is no item in your cart</td>
                                        }
                                    </MDBTableBody>
                                </MDBTable>
                            </div>

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
                                                <MDBPageNav style={{background:'#343A40'}}>
                                                    {this.state.page + 1} <span className="sr-only">(current)</span>
                                                </MDBPageNav>
                                            </MDBPageItem>

                                            <MDBPageItem>
                                                {
                                                    this.state.productData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage).length < 3 || this.state.productData.length / (this.state.page + 1) === this.state.contentPerPage
                                                        ?
                                                        null
                                                        :
                                                        <MDBPageNav onClick={() => this.setState({ page: this.state.page + 1 })}>{this.state.page + 2}</MDBPageNav>
                                                }
                                            </MDBPageItem>

                                            {
                                                this.state.productData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage).length < 3 || this.state.productData.length / (this.state.page + 1) === this.state.contentPerPage
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
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header border-0">
                                <h3 className='text-center mt-1'>New Product</h3>
                            </div>

                            <div className="card-body">
                                <div className="col-md-8 offset-md-2">
                                    <MDBInput outline label="Product Name" value={this.state.inputName} onChange={(e) => this.setState({ inputName: e.target.value })} />
                                    <div className="row my-n3">
                                        <div className="col-md-8">
                                            <MDBInput outline label="Price" value={this.state.inputPrice} type='number' onChange={(e) => this.setState({ inputPrice: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <MDBInput outline label="Discount" value={this.state.inputDiscount} min="0" type='number' onChange={(e) => this.setState({ inputDiscount: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <MDBInput outline label="Category" value={this.state.inputCategory} onChange={(e) => this.setState({ inputCategory: e.target.value })} />
                                        </div>
                                        <div className="col-md-8">
                                            <MDBInput outline label="Image URL" value={this.state.inputImg} onChange={(e) => this.setState({ inputImg: e.target.value })} />                               
                                        </div>
                                    </div>
                                    <MDBInput style={{ resize: 'none' }} value={this.state.inputDesc} type="textarea" label="Description (Max. 200 characters)" className='border rounded mt-n3' rows='3' maxlength="200" onChange={(e) => this.setState({ inputDesc: e.target.value })} outline />
                                </div>
                                <div className="row my-auto">
                                    <div className="col-md-4 offset-md-3">
                                        <MDBBtn color='deep-orange' className='btn-block white-text' onClick={this.onBtnAddProduct}>Add Product</MDBBtn>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userObj: state.user
    }
}

export default connect(mapStateToProps)(ManageProduct)