import React, { Component } from 'react'
import Axios from 'axios'
import { urlApi } from '../../2.helpers/database'
import {Link} from 'react-router-dom'


class ParaSultan extends Component {
    state = {
        dataSultan : [],
        namaSultan: ''
    }

    componentDidMount() {
        Axios.get(urlApi + 'history')
            .then(res => {
                this.setState({
                    dataSultan: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }


    renderSultan = () => {
        var duit = []
        var idSultan = 0
        var duitSultan = 0

        this.state.dataSultan.map((val) => {
            return duit.push(Number(val.totalPrice))
        })

        // Mencari duit terbesar
        duit.sort(function (a, b) { return b - a })
        duitSultan = duit[0]

        // Mencari nama sultan nya
        Axios.get(urlApi + 'history?totalPrice=' + duitSultan)
            .then(res => {
                idSultan = res.data[0].userId
                Axios.get(urlApi + 'users?id=' + idSultan)
                    .then(res => {
                        this.setState({ namaSultan: res.data[0].username})
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
        
        return(
            <p>User paling sultan adalah <strong>{this.state.namaSultan}</strong> dengan belanja tertinggi <strong>Rp {new Intl.NumberFormat('id-ID').format(duitSultan)}</strong></p>
        )
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3 text-center">
                            <div className="card-header border-0 pt-5">
                                <h4>Orang Kaya</h4>
                            </div>
                            <div className="card-body">
                                {this.renderSultan()}
                            </div>
                            <div className="card-footer align-items-center">
                                Ayo&nbsp;
                                <Link className='text-decoration-none' to='/'>
                                    kalahkan {this.state.namaSultan}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParaSultan