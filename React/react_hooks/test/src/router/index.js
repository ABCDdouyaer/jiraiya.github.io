import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
}from 'react-router-dom';




import T1 from '../view/useState';
import T2 from '../view/display';
import T3 from '../view/introduce';
import T4 from '../view/effect';

class Routes extends Component{
    render(){
       return  <Router>
                  <div>
                    <ul className='myul'>
                        <li><Link to='/'> <span>首页</span></Link></li>
                        <li><Link to='/render'> <span>props.render</span></Link></li>
                        <li><Link to='/super'> <span>高阶组件</span></Link></li>
                        <li><Link to='/effect'> <span>useEffect</span></Link></li>
                    </ul>
                    <Route exact path='/' component={T1} />
                    <Route path='/render' component={T2} />
                    <Route path='/super' component={T3} />
                    <Route path='/effect' component={T4} />
                  </div>
               </Router>
             
    }
}
export default Routes;