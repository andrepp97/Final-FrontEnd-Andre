import React, { Component } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import './Navbar.css'
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { userLogout } from '../../redux/1.actions';
import swal from 'sweetalert';


class NavbarBro extends Component {
    state = {
        navOpen : false
    }

    onLogout = () => {
        this.props.userLogout('')
        swal("Anda telah Logout!", "", "info");
    }


    render() {
        return (
            <div className='navBro'>

                <Navbar color="dark" dark expand="md">
                    <Link className='logoBro' to='/'><NavbarBrand>tokoaku</NavbarBrand></Link>
                    <NavbarToggler onClick={() => this.setState({navOpen : !this.state.navOpen})} />
                    <Collapse isOpen={this.state.navOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {
                                this.props.namaUser !== '' && this.props.roleUser !== ''
                                ?
                                <>
                                    <NavItem>
                                        <NavLink>{this.props.roleUser}</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle nav caret className='badge-secondary rounded' style={{color:'white'}}>
                                            {this.props.namaUser}&nbsp;
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                Edit Profile
                                            </DropdownItem>
                                            <DropdownItem>
                                                My Cart
                                            </DropdownItem>
                                            <DropdownItem>
                                                Shopping History
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={this.onLogout} >
                                                Logout
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                                :
                                <>
                                    <NavItem>
                                        <Link onClick={() => this.setState({navOpen : !this.state.navOpen})} to='/Login'><NavLink>Log In</NavLink></Link>
                                    </NavItem>    
                                    <NavItem>
                                        <Link onClick={() => this.setState({navOpen : !this.state.navOpen})} to='/Register'><NavLink>Register</NavLink></Link>
                                    </NavItem>      
                                </>
                            }

                        </Nav>
                    </Collapse>
                </Navbar>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        namaUser: state.user.username,
        roleUser : state.user.role
    }
}

export default connect(mapStateToProps, {userLogout})(NavbarBro)