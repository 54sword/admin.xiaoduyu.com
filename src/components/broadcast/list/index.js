import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import connectReudx from '../../../common/connect-redux'
import { loadBroadcastList, updateBroadcast } from '../../../actions/broadcast'
import { getBroadcastListByName } from '../../../reducers/broadcast'

// import { DateDiff } from '../../../common/date'

// import ListLoading from '../../list-loading'
// import HTMLText from '../../html-text'


export class NotificationList extends Component {

  static propTypes = {
    notification: PropTypes.object.isRequired,
    loadBroadcastList: PropTypes.func.isRequired
  }

  static mapStateToProps = (state, props) => {
    return {
      notification: getBroadcastListByName(state, props.name)
    }
  }

  static mapDispatchToProps = { loadBroadcastList, updateBroadcast }

  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
    this.updateBroadcast = this.updateBroadcast.bind(this)
  }

  componentDidMount() {
    const { notification } = this.props
    if (!notification.data) this.handleLoad()
    ArriveFooter.add('notification', this.handleLoad)
  }

  componentWillUnmount() {
    ArriveFooter.remove('index')
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadBroadcastList } = this.props
      loadBroadcastList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  updateBroadcast(id, data) {
    const { updateBroadcast } = this.props
    updateBroadcast({
      query: { _id: id },
      update: data
    })
  }

  handleLoad() {
    const { name, filters, loadBroadcastList } = this.props
    loadBroadcastList({ name, filters })
  }

  render() {

    const { notification } = this.props

    if (!notification.data) {
      return (<div></div>)
    }

    if (notification.data && notification.data.length == 0) {
      return (<div styleName="nothing">没有通知</div>)
    }

    const { data, loading, more } = notification

    return (<div>
        <table styleName="table">
          <tbody>
          {notification.data.map(item=>{

            let backgroundColor = '#fff'

            if (item.deleted) {
              backgroundColor = '#ffe3e3'
            }

            return (<tr key={item._id} style={{backgroundColor}}>
              <td>{item.sender_id.nickname}</td>
              <td>{item.type}</td>
              <td>{item._create_at}</td>
              <td>
                {item.type == 'new-comment' ? <Link to={`/comments?_id=${item.target}`}>{item.target}</Link> : ''}
              </td>
              <td>通知人数:{item.addressee_id ? item.addressee_id.length : 0}</td>
              <td>
                <a href="javascript:void(0)" onClick={()=>{ this.updateBroadcast(item._id, { deleted: item.deleted ? false : true }) }}>
                  {item.deleted ? '已删除' : '删除'}
                </a>
              </td>
            </tr>)
          })}
        </tbody>
        </table>
      </div>
    )
  }
}

NotificationList = CSSModules(NotificationList, styles)

export default connectReudx(NotificationList)
