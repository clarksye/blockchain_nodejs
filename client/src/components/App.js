import React, { Component } from 'react';
import Blocks from './Blocks';
import logo from '../assets/logo.png';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return <div className='App'>
            <img src={logo} className="logo" alt="application-logo" />
            <div>Welcome to the blockchain...</div>
            <div className='WalletInfo'>
                <div>Address: <br /> {address}</div>
                <div>Balance: <br /> {balance}</div>
            </div>
            <br />
            <Blocks />
        </div>;
    }
}

export default App; 