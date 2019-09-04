import React, { Component } from 'react';
import './style.css'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import ManageProduct from './ManageProduct';
import ParaSultan from './ParaSultan';


class AdminDashboard extends Component {
    state = {
        tabMenu: 1
    }

    render() {
        if (this.props.role !== 'admin')
            return <Redirect to="/" />

        return (
            <div className='mt-5'>
                <div>&nbsp;</div>
                <div className="admin-tab text-center d-flex mt-5 shadow">
                    <div style={{ flex: 1 }} onClick={() => this.setState({ tabMenu: 1 })} className={'admin-tab-menu ' + (this.state.tabMenu === 1 ? "admin-tab-selected" : null)}>Manage Product</div>
                    <div style={{ flex: 1 }} onClick={() => this.setState({ tabMenu: 2 })} className={'admin-tab-menu ' + (this.state.tabMenu === 2 ? "admin-tab-selected" : null)}>Best Selling Products</div>
                    <div style={{ flex: 1 }} onClick={() => this.setState({ tabMenu: 3 })} className={'admin-tab-menu ' + (this.state.tabMenu === 3 ? "admin-tab-selected" : null)}>Para Sultan</div>
                </div>
                <div className="admin-content">
                    {this.state.tabMenu === 1 ? <ManageProduct /> : null}
                    {this.state.tabMenu === 3 ? <ParaSultan /> : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.user.role
    }
}

export default connect(mapStateToProps)(AdminDashboard);