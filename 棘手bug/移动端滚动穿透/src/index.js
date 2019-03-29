import React, {Component} from 'react';
import ReactDOM from 'react-dom';
require('./index.scss');

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 10],
            show: false
        }
    }

    componentDidMount(){
        document.addEventListener('touchmove', e => {
            e.preventDefault();
        }, {passive: false})
    }

    showModal(){
        this.setState({show: true})
    }

    hideModal(){
        this.setState({show: false})
    }

    render(){
        const {num, show} = this.state;
        return <>
                    {show ? <div className='maskLayer' onClick={this.hideModal.bind(this)}></div> : null}
                    <div className='rollingBox' onClick={this.showModal.bind(this)}>
                        {
                            num.map(e => {
                                return <p>{ e }</p>
                            })
                        }
                    </div>
               </>
    }
}


ReactDOM.render(<App />, document.getElementById('app'));