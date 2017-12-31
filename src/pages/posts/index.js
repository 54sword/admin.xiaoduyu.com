import React from 'react'
import { Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { update } from '../../actions/account'
// import { getAccessToken } from '../../reducers/account'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Shell from '../shell'

import PostsList from '../../components/posts-list'

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)


// 纯组件
export class Posts extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '12312313'
    }
  }

  componentWillMount() {
    this.props.setMeta({
      title: '帖子'
    })
  }

  render() {
    return(<div>
      <div>
        <div>
          排序
          <select>
            <option>创建日期</option>
            <option>排序日期</option>
          </select>
        </div>

        <div>
          状态
          <select>
            <option>所有</option>
            <option>正常</option>
            <option>弱化</option>
            <option>删除</option>
          </select>
        </div>

        <div>
          ID<input type="text" placeholder="请输入id" />
        </div>

        <button>搜索</button>

      </div>
      <PostsList name="home" filters={{}} />
    </div>)
  }

}

Posts = CSSModules(Posts, styles)

Posts.propTypes = {
  // update: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // update: bindActionCreators(update, dispatch)
  }
}

Posts = connect(mapStateToProps,mapDispatchToProps)(Posts)

export default Shell(Posts)
