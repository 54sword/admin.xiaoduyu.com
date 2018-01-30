import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

// 依赖的外部功能
// import arriveFooter from '../../common/arrive-footer'
import connectReudx from '../../../common/connect-redux'

// actions and reducers
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsList } from '../../../actions/posts'
import { getPostsListByName } from '../../../reducers/posts'

// import ListLoading from '../list-loading'
import PostsItem from '../../posts/posts-item'

export class PostsList extends Component {

  static mapStateToProps = (state, props) => {
    const { name } = props
    return {
      postsList: getPostsListByName(state, name)
    }
  }

  static mapDispatchToProps = { loadPostsList }

  constructor(props) {
    super(props)
    this.loadDate = this.loadDate.bind(this)
  }

  componentDidMount() {

    const { postsList, loadPostsList, name } = this.props

    if (!postsList.data) this.loadDate()

    ArriveFooter.add(name, this.loadDate)
  }

  componentWillUnmount() {
    const { name } = this.props
    ArriveFooter.remove(name)
  }

  async loadDate() {
    const { name, filters, loadPostsList } = this.props
    await loadPostsList({ name, filters })
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadPostsList } = this.props
      loadPostsList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  render () {
    const { displayFollow = false, displayDate = true, postsList, loadPostsList, commentOption = {} } = this.props

    // 当没有数据的情况
    if (typeof postsList.data == "undefined") {
      return (<div></div>)
    }

    const { data, loading, more } = postsList

    return (
      <div>
        {data.map(posts=>{
          return (<div key={posts._id}>
              <PostsItem
              posts={posts}
              displayFollow={displayFollow}
              displayDate={displayDate}
              commentOption={commentOption}
              />
            </div>)
        })}
        {/*
        <ListLoading
          loading={loading}
          more={more}
          handleLoad={loadPostsList}
          />
        */}
      </div>
    )
  }

}

PostsList.propTypes = {
  name: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired
}

export default connectReudx(PostsList)
