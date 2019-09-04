import React, { Component } from 'react'
import Axios from 'axios'
import { urlApi } from '../../2.helpers/database'


class ParaSultan extends Component {
    state = {
        productData : []
    }

    componentDidMount() {
        Axios.get(urlApi + 'cart?userId=3')
            .then(res => {
                this.setState({
                    productData: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }


    renderData = () => {
        return this.state.productData.length
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0 pt-5">
                                {/* <h3>Admin Dashboard</h3> */}
                            </div>
                            <div className="card-body">
                                {this.renderData()}
                            </div>
                            <div className="card-footer align-items-center">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParaSultan