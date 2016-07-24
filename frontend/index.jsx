/**
 * Created by noonon on 6/12/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import MainComponent from 'components/main/index.jsx';

require('style/init.styl');

var Main = new MainComponent(React);

ReactDOM.render(<Main/>, document.querySelector('.container-fluid'));
