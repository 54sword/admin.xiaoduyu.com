import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import NotificationList from '../../components/notification/list'

import Meta from '../../components/meta'

// 纯组件
export class Notification extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return(<div>
      <h1>通知</h1>
      <Meta
        meta={{
          title: '通知'
        }}
        />
      <NotificationList name="home" filters={{}} />
    </div>)
  }

}

Notification = CSSModules(Notification, styles)

export default Shell(Notification)
