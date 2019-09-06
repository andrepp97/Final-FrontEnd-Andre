import React, { Component } from 'react'
import Axios from 'axios'
import { urlApi } from '../../2.helpers/database'

class Analytics extends Component {
    state = {
        dataBro : []
    }

    componentDidMount() {
        this.getData()
    }
    

    getData = () => {
        Axios.get(urlApi + 'history')
            .then(res => {
                this.setState({
                    dataBro: res.data
                })
                console.log(this.state.hisData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderIncome = () => {
        var incomeBro = 0
        
        this.state.dataBro.map((val) => {
            return incomeBro += Number(val.totalPrice)
        })

        return new Intl.NumberFormat('id-ID').format(incomeBro)
    }


    render() {
        return (
            <div className='container'>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0 pt-5 text-center">
                                <h4>Total Income</h4>
                            </div>
                            <div className="card-body text-center">
                                <p>Total pendapatan dari belanjaan pengguna adalah</p>
                                <strong style={{letterSpacing:'.5px'}}>Rp {this.renderIncome()}</strong>
                            </div>
                            <div className="card-footer align-items-center">
                                <em className='mt-2 text-center'>*Pendapatan dihitung dari <strong>{this.state.dataBro.length}</strong> transaksi yang berhasil.</em>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Analytics