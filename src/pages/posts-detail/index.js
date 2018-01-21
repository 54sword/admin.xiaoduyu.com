import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import Detail from '../../components/posts/detail'
import CommentList from '../../components/comment/list'
import CommentItem from '../../components/comment/list-item'

import { loadPostsList } from '../../actions/posts'

// 纯组件
export class PostsDetail extends React.Component {

  static loadData({ store, match, userinfo }) {

    // console.log(match);

    const { id } = match.params

    return new Promise(async function (resolve, reject) {

      let res = await loadPostsList({ name: id, filters: { query: { _id: id } } })(store.dispatch, store.getState)
      // console.log(res);
        resolve({ code:200, resr: '123' });
    })

  }

  constructor(props) {
    super(props)
  }

  render() {

    const id = this.props.match.params.id

    return (<div>
      <Detail id={id} />
      <CommentList
        CommentItem={CommentItem}
        name={id}
        filters={{
          posts_id: id, parent_exists: 0, per_page:100
        }}
        />
    </div>)
  }

}

export default Shell(PostsDetail)
