import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from "./App"
import {
  HashRouter as Router,
  Route, Routes
} from 'react-router-dom';

import { User, Repo } from './user';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='/user/:username' element={ <User /> } />
      <Route path='/user/:username/repos/:repo' element={ <Repo /> } />
    </Routes>

  </Router>,
  document.getElementById("root")
);