import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import Detail from '../../components/posts/detail'
import CommentList from '../../components/comment/list'

// 纯组件
export class PostsDetail extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const id = this.props.match.params.id

    return (<div>
      <Detail id={id} />
      <CommentList
        name={id}
        filters={{
          posts_id: id, parent_exists: 0, per_page:100
        }}
        />
    </div>)
  }

}

export default Shell(PostsDetail)
