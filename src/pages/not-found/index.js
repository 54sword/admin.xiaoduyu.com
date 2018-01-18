import React from 'react'
import { Route, Link } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Shell from '../shell'

// 纯组件
export class NotFound extends React.Component {

  static loadData({ store, match, userinfo }) {
    return new Promise(async function (resolve, reject) {
      resolve({ code:404 });
    })
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return(<div>
      404,无法找到该页面
    </div>)
  }

}

NotFound = CSSModules(NotFound, styles)

export default Shell(NotFound)
