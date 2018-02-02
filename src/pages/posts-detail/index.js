import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import Detail from '../../components/posts/detail'
import CommentList from '../../components/comment/list'

import { loadPostsList } from '../../actions/posts'

import Meta from '../../components/meta'

// 纯组件
export class PostsDetail extends React.Component {

  static loadData({ store, match, userinfo }) {
    const { id } = match.params
    return new Promise(async function (resolve, reject) {
      let res = await loadPostsList({
        name: id,
        filters: {
          variables: { _id: id }
        }
        // filters: { query: { _id: id } }
      })(store.dispatch, store.getState)
      resolve({ code:200, resr: '123' });
    })
  }

  constructor(props) {
    super(props)
  }

  render() {

    const id = this.props.match.params.id

    return (<div>
      <Detail id={id} Meta={Meta} />
      <CommentList
        name={id}
        filters={{
          query: {
            posts_id: id,
            parent_id: {
              '$exists': false
            }
          },
          options: {
            limit: 100
          }
        }}
        />
    </div>)
  }

}

export default Shell(PostsDetail)
