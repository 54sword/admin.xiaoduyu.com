import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import PostsList from '../../components/posts-list'


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

        <div>
          日期筛选：开始日期<input type="text" placeholder="开始日期" /> 结束日期<input type="text" placeholder="结束日期" />
        </div>

        <button>搜索</button>

      </div>
      <PostsList name="home" filters={{}} />
    </div>)
  }

}

Posts = CSSModules(Posts, styles)

export default Shell(Posts)
