import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import PeopleList from '../../components/people-list'

export class People extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.props.setMeta({
      title: '用户'
    })
  }

  render() {
    return(<div>
      <div>
        <h1>用户</h1>
      </div>
      <PeopleList
        name="home"
        filters={{
          select: '_id,nickname,follow_node_count,follow_posts_count,follow_topic_count,comment_count,posts_count,source,brief,avatar,avatar_url,role,blocked,last_sign_at,nickname_reset_at,create_at'
        }}
        />
    </div>)
  }

}

People = CSSModules(People, styles)

export default Shell(People)
