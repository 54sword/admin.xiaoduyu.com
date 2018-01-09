import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import avatarPicker from '../../common/avatar-picker'
// import styles from './style.scss'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import { loadTopicById, loadTopics, updateTopicById } from '../../actions/topic'
// import { getTopicListByName, getTopicById } from '../../reducers/topic'
// import { getProfile } from '../../reducers/user'

import { addTopic, loadTopics } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import Shell from '../shell'
// import Meta from '../../components/meta'
// import Subnav from '../../components/subnav'
// import QiniuUploadImage from '../../components/qiniu-upload-image'

class EditTopic extends Component {

  static mapStateToProps = (state, props) => {
    return {
      topicList: getTopicListByName(state, 'edit-topic-page')
    }
  }

  static mapDispatchToProps = { addTopic, loadTopics }

  constructor(props) {
    super(props)
    this.state = {
      updateButton: <div></div>,
      image: ''
    }
    this.submit = this.submit.bind(this)
    this.upload = this.upload.bind(this)
  }

  async componentDidMount() {

    // console.log('123123');

    const { loadTopics, topicList } = this.props

    console.log(topicList);

    if (!topicList.data || topicList.data.length == 0) {
      await loadTopics({
        name: 'edit-topic-page',
        filters: {
          query: {
            parent_id: { $exists : false }
          },
          options: {
            limit: 1000,
            sort: {
              sort: -1
            }
          }
        }
      })

      // console.log(s);
    }

    /*
    const self = this
    const { loadTopicById, loadTopics, nodes } = this.props
    const [ node ] = this.props.node

    if (!node) {
      loadTopicById({
        id: this.props.params.id,
        callback: (n)=>{

          if (n) {
            self.setState({
              image: n.avatar
            })
          }

        }
      })
    } else {
      self.setState({
        image: node.avatar
      })
    }

    if (!nodes.data) {
      loadTopics({ name: 'edit-node', filters: { child: -1 } })
    }
    */

  }

  // componentDidMount() {
    /*
    this.setState({
      updateButton: <QiniuUploadImage upload={this.upload} multiple={false} name={'上传社群封面'} />
    })
    */
  // }

  upload(url) {

    const self = this

    avatarPicker({
      img: url,
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: function() {},
      done: function(p){
        self.setState({
          image: url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"
        })
      }
    })

  }

  async submit(event) {

    if (event) event.preventDefault()

    const self = this
    const { addTopic } = this.props
    const { name, brief, description, parentTopic } = this.refs
    // const { image } = this.state
    // const { id } = this.props.params

    // if (!image) return alert('请上传社群封面')
    if (!name.value) return name.focus()
    if (!brief.value) return brief.focus()
    if (!description.value) return description.focus()
    if (parentTopic.value == -1) return alert('请选择分类')

    let res = await addTopic({
      data: {
        save: {
          name: name.value,
          brief: brief.value,
          avatar: '',
          description: description.value,
          parent_id: parentTopic.value,
        }
      }
    })

    console.log(res);

    /*
    updateTopicById({
      id:id,
      name: name.value,
      brief: brief.value,
      avatar: image,
      description: description.value,
      parentId: node.value,
      callback: (res) => {

        if (res && res.success) {
          self.context.router.goBack()
        } else {
          alert(res.error || '更新失败')
        }

      }
    })
    */

    return false

  }

  render() {
    /*
    const { updateButton, image } = this.state
    const { me, nodes } = this.props
    const [ node ] = this.props.node

    if (!node || !nodes.data || nodes.loading) {
      return (<div></div>)
    }
    */

    const { topicList } = this.props

    let node

    return (<form className="form" onSubmit={this.submit}>

      <div className="list">
        <br />
        <div className={styles.avatar}>
          {/*image ? <img src={image} /> : null*/}
        </div>
        <br />
      </div>

      <input type="text" ref="name" defaultValue={node ? node.name : ''} placeholder="名称"></input>
      <input type="text" ref="brief" defaultValue={node ? node.brief : ''} placeholder="简介"></input>
      <textarea styleName="description" ref="description" defaultValue={node ? node.description : ''} placeholder="详细描述"></textarea>

      <select ref="parentTopic" defaultValue={node ? node.parent_id : '-1'}>
        <option value="-1">请选择分类</option>
        <option value="">无父类</option>
        {topicList.data && topicList.data.map(item=>{
          return (<option key={item._id} value={item._id}>{item.name}</option>)
        })}
      </select>

      <button className="btn btn-primary">提交</button>

    </form>)

  }

}


EditTopic.contextTypes = {
  router: PropTypes.object.isRequired
}

/*
EditTopic.propTypes = {
  node: PropTypes.array.isRequired,
  nodes: PropTypes.object.isRequired,
  loadTopics: PropTypes.func.isRequired,
  loadTopicById: PropTypes.func.isRequired,
  updateTopicById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    nodes: getTopicListByName(state, 'edit-node'),
    node: getTopicById(state, props.params.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadTopics: bindActionCreators(loadTopics, dispatch),
    loadTopicById: bindActionCreators(loadTopicById, dispatch),
    updateTopicById: bindActionCreators(updateTopicById, dispatch)
  }
}

EditTopic = connect(mapStateToProps, mapDispatchToProps)(EditTopic)
*/

EditTopic = CSSModules(EditTopic, styles)

export default Shell(EditTopic)
