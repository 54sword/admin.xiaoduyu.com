import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import NotificationList from '../../components/notification-list'


// 纯组件
export class Notification extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.props.setMeta({
      title: '通知'
    })
  }

  render() {
    return(<div>
      <h1>通知</h1>
      <NotificationList name="home" filters={{}} />
    </div>)
  }

}

Notification = CSSModules(Notification, styles)

export default Shell(Notification)
