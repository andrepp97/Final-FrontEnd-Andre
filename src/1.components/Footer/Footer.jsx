import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        return (
            <div className='footer'>
                <h2 className='text-center mb-4'>IKI FOOTER CUK</h2>
                <p className='text-center'>&copy; <a style={{color:'lightgray', fontSize:14}} href="http://andreputerap.firebaseapp.com" target="_blank" rel="noopener noreferrer">Andre Putera Pratama</a></p>
            </div>
        )
    }
}
