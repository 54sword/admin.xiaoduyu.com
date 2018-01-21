import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Shell from '../shell'
import CommentList from '../../components/comment/list'
// import CommentItem from '../../components/comment/list-item-admin'

export class Comment extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div>
      <h1>评论</h1><CommentList
        name="home"
        sql={{
          select: {
            user_id:1,
            posts_id:1,
            parent_id:1,
            reply_id:1,
            _id:1,
            weaken:1,
            verify:1,
            deleted:1,
            blocked:1,
            ip:1,
            device:1,
            like_count:1,
            reply_count:1,
            create_at:1,
            content_html:1
          },
          options: { sort: { create_at: -1 } }
        }}
        />
    </div>)
  }

}

Comment = CSSModules(Comment, styles)

export default Shell(Comment)
