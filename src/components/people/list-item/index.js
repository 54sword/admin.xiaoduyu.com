import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import { updatePeople } from '../../../actions/people'
// import connectRedux from '../../../common/connect-redux'
import Actions from '../actions'

class PeopleItem extends Component {

  // static mapDispatchToProps = { updatePeople }

  constructor(props) {
    super(props)
  }

  render () {

    const { people } = this.props

    let time = new Date(people.banned_to_post).getTime() - new Date().getTime()
    if (time > 0) {
      time = parseInt(time / (1000 * 60))
    } else if (time < 0) {
      time = 0
    }

    let source = {
      0: 'iPhone',
      1: 'iPad',
      2: 'Android',
      3: 'H5',
      4: '网站',
      5: 'iOS'
    }

    let background = '#fff'

    if (time > 0) background = '#efefef'
    if (people.blocked) background = '#ffe3e3'

    return (<table styleName="table" style={{backgroundColor:background}}>
      <tbody>
        <tr>
          <td width="200">
            <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${people.avatar_url} />`}></i>
            <div><Link to={`/people/${people._id}`}>{people.nickname}</Link></div>
            <div>{people.brief}</div>
          </td>
          <td width="200">
            {people.block_posts_count ? <span>屏蔽了 {people.block_posts_count} 个帖子</span> : null}
            {people.block_people_count ? <span>屏蔽了 {people.block_people_count} 个用户</span> : null}
            {people.follow_posts_count ? <span>关注了 {people.follow_posts_count} 个帖子</span> : null}
            {people.follow_topic_count ? <span>关注了 {people.follow_topic_count} 个话题</span> : null}
            {people.follow_people_count ? <span>关注了 {people.follow_people_count} 个话题</span> : null}
          </td>
          <td>
            创建日期：{people.create_at}<br />
            最近一次登陆：{people.last_sign_at}<br />
          </td>
          <td width="200">
            注册来源：{source[people.source]}
          </td>
          <td width="200">
            <Actions people={people} />
          </td>
        </tr>
      </tbody>
    </table>)

  }

}

PeopleItem = CSSModules(PeopleItem, styles)

export default PeopleItem
