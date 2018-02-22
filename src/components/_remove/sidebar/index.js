import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class Sidebar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div>
        <ul>
          <li><NavLink exact to="/">首页</NavLink></li>
          <li><NavLink exact to="/posts">帖子</NavLink></li>
          <li><NavLink exact to="/topics">话题</NavLink></li>
          <li><NavLink exact to="/peoples">用户</NavLink></li>
          <li><NavLink exact to="/comments">评论</NavLink></li>
          <li><NavLink exact to="/user-notifications">用户通知</NavLink></li>
          <li><NavLink exact to="/notifications">广播通知</NavLink></li>
        </ul>
      </div>)
  }

}

Sidebar = CSSModules(Sidebar, styles)

export default Sidebar
