import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class Sidebar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
        <ul styleName="head">
          <li><NavLink exact to="/">首页</NavLink></li>
          <li><NavLink exact to="/posts">帖子</NavLink></li>
          <li><NavLink exact to="/topics">话题</NavLink></li>
        </ul>
      )
  }

}

Sidebar = CSSModules(Sidebar, styles)

export default Sidebar
