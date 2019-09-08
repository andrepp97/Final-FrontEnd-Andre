import React, { Component } from 'react'
import { connect } from "react-redux"
import { userLogout } from '../../redux/1.actions'
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBCardText, MDBBtn, MDBTooltip, MDBBadge
} from "mdbreact"
import { Link } from 'react-router-dom'
import Cookie from "universal-cookie"
import { getCartQty } from '../../redux/1.actions'

// Cookie
let cookieObj = new Cookie()

class NavbarBro extends Component {
    state = {
        navOpen : false
    }

    onLogout = () => {
        cookieObj.remove('userData')
        this.props.userLogout()
    }

    componentDidMount() {
        this.props.getCartQty(this.props.userObj.id)
    }


    render() {
        return (
            <div>
                <MDBNavbar color="deep-orange" scrolling fixed="top" dark expand="md">
                    <MDBNavbarBrand>
                        <MDBNavLink to='/'>
                            <strong className="white-text">tokoaku</strong>
                        </MDBNavLink>
                    </MDBNavbarBrand>

                    <MDBNavbarToggler onClick={() => this.setState({ navOpen: !this.state.navOpen })} />
                    <MDBCollapse id="navbarCollapse" isOpen={this.state.navOpen} navbar>
                        <MDBNavbarNav right>
                            {
                                (this.props.userObj.username) && (this.props.userObj.role)
                                ?
                                <>
                                    {
                                        this.props.userObj.role === 'admin'
                                        ?
                                        <MDBTooltip placement="left">
                                            <Link to='/adminDashboard'>
                                                <MDBBtn color='none'><MDBIcon icon="tachometer-alt" style={{marginTop:'2px', color:'white', fontSize:'120%'}} /></MDBBtn>
                                            </Link>
                                            <div>Admin Dashboard</div>
                                        </MDBTooltip>
                                        :
                                        <MDBTooltip placement="bottom">
                                            <Link to='/Cart'>
                                                    <MDBBadge color='dark' className='mr-n3 rounded-circle'>
                                                        {
                                                            this.props.userCart > 0
                                                            ?
                                                            this.props.userCart
                                                            :
                                                            null
                                                        }
                                                    </MDBBadge>
                                                <MDBBtn color='none'><MDBIcon icon="shopping-basket" style={{ marginTop: '2px', color: 'white', fontSize: '120%' }} />
                                                </MDBBtn>
                                            </Link>
                                            
                                            {
                                                this.props.userCart > 0
                                                ?
                                                <p>
                                                    You have {this.props.userCart} items in your cart
                                                </p>
                                                :
                                                <p>My Cart</p>
                                            }
                                        </MDBTooltip>
                                    }


                                    <MDBNavItem>
                                        <MDBDropdown>
                                            <MDBDropdownToggle nav caret>
                                                <MDBIcon icon="user" style={{fontSize:'125%', marginTop:'7px', marginLeft:'5px'}} />
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu right className="dropdown-default">
                                                <MDBCardText style={{paddingLeft:'24px'}}><span style={{color:'grey', fontSize:'12px'}}>Hello,</span><br/><strong>{this.props.userObj.username}</strong></MDBCardText>
                                                
                                                {
                                                    this.props.userObj.role === 'admin'
                                                    ?
                                                    null
                                                    :
                                                    <>
                                                        <MDBDropdownItem divider></MDBDropdownItem>
                                                        <MDBDropdownItem className='dropItem' style={{fontSize:'14px'}}><MDBIcon fab icon="gratipay" />
                                                            <Link style={{textDecoration:'none', marginLeft:'-6px'}} to='/wishlist'>
                                                                &nbsp;My Wishlist
                                                            </Link>
                                                        </MDBDropdownItem>
                                                        <MDBDropdownItem className='dropItem' style={{fontSize:'14px'}}><MDBIcon icon="history" />
                                                            <Link style={{textDecoration:'none', marginLeft:'-6px'}} to='/history'>
                                                                &nbsp;Shopping History
                                                            </Link>
                                                        </MDBDropdownItem>
                                                    </>
                                                }
                                                
                                                <MDBDropdownItem divider></MDBDropdownItem>
                                                <MDBDropdownItem className='dropItem' style={{fontSize:'14px'}} onClick={this.onLogout}>
                                                    <Link style={{textDecoration:'none', marginLeft:'-10px'}} to='/'>
                                                        <MDBIcon icon="power-off" /> &nbsp;Logout
                                                    </Link>
                                                </MDBDropdownItem>
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </MDBNavItem>
                                </>
                                :
                                <>
                                    <MDBNavItem>
                                        <MDBNavLink to='/Login'>
                                            <MDBBtn color="none" className='white-text'>Login</MDBBtn>
                                        </MDBNavLink>
                                    </MDBNavItem>    
                                    <MDBNavItem>
                                        <MDBNavLink to='/Register'>
                                            <MDBBtn color="orange" className='white-text'>Register</MDBBtn>
                                        </MDBNavLink>
                                    </MDBNavItem>      
                                </>
                            }
                        </MDBNavbarNav>
                    </MDBCollapse>

                </MDBNavbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userObj: state.user,
        userCart: state.cart.cartLength
    }
}

export default connect(mapStateToProps, {getCartQty, userLogout})(NavbarBro)