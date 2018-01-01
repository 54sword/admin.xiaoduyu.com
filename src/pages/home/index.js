import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { update } from '../../actions/account'
// import { getAccessToken } from '../../reducers/account'
import Promise from 'promise'

import { withRouter } from 'react-router-dom'

import Shell from '../shell'
import Meta from '../../components/meta'

// 纯组件
export class Home extends React.Component {


  static loadData({ store, match, userinfo }) {

    return new Promise(function (resolve, reject) {
        resolve({ code:200, resr: '123' });
    })

  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    // this.props.setMeta({
    //   title: '小度鱼后台管理'
    // })

      // console.log('服务端渲染');

  }

  componentDidMount() {

  }

  render() {

    // const { accessToken } = this.props.accessToken

    return(<div>
        <Meta
          meta={{
            title: '122222'
          }}
        />
        <h1>首页</h1>
        <div>当前注册用户：</div>
        <div>帖子总数1：</div>
        <div>评论总数2：</div>
        <div>恢复总数2：</div>
    </div>)
  }

}

Home.propTypes = {
  // accessToken: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    // accessToken: getAccessToken(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

Home = withRouter(connect(mapStateToProps,mapDispatchToProps)(Home))

export default Shell(Home)
