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
    }
  }

  componentDidMount() {
    // this.props.update('ttt')
    // console.log(this.props.location.params);
  }

  render() {
    return(<div>
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
