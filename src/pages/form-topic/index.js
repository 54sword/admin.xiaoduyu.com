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

import { addTopic, updateTopic, loadTopics, loadTopicById } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import Shell from '../shell'
// import Meta from '../../components/meta'
// import Subnav from '../../components/subnav'
import QiniuUploadImage from '../../components/qiniu-upload-image'

class EditTopic extends Component {

  static mapStateToProps = (state, props) => {

    let obj = {
      topicList: getTopicListByName(state, 'edit-topic-page')
    }

    if (props.match.params.id) {
      obj.topic = getTopicListByName(state, props.match.params.id)
    }

    return obj
  }

  static mapDispatchToProps = { addTopic, updateTopic, loadTopics, loadTopicById }

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

    const { id } = this.props.match.params
    const { loadTopics, topicList, loadTopicById } = this.props

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
    }

    // 编辑状态，加载id
    if (id) await loadTopicById({ id })


    this.setState({
      updateButton: <QiniuUploadImage upload={this.upload} multiple={false} name={'上传社群封面'} />
    })

    avatarPicker({
      img: 'http://img.xiaoduyu.com/586658ea1985b4532700fd0a.jpg',
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: function() {},
      done: function(p){
        console.log(p);
        // self.setState({
        //   image: url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"
        // })
      }
    })

  }

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
    const { addTopic, updateTopic } = this.props
    const { name, brief, description, parentId } = this.refs
    // const { image } = this.state
    // const { id } = this.props.params
    const { id } = this.props.match.params

    // if (!image) return alert('请上传社群封面')
    if (!name.value) return name.focus()
    if (!brief.value) return brief.focus()
    if (!description.value) return description.focus()
    if (parentId.value == -1) return alert('请选择分类')



    if (id) {

      let res = await updateTopic({
        data: {
          query: { _id: id },
          update: {
            name: name.value,
            brief: brief.value,
            avatar: '',
            description: description.value,
            parent_id: parentId.value
          }
        }
      })

      console.log(res);

      return
    }

    let res = await addTopic({
      data: {
        save: {
          name: name.value,
          brief: brief.value,
          avatar: '',
          description: description.value,
          parent_id: parentId.value,
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

    let { topicList, topic } = this.props
    let { updateButton } = this.state

    // 编辑状态
    const { id } = this.props.match.params

    if (topic && topic.data && topic.data.length > 0) {
      topic = topic.data[0]
    } else {
      topic = null
    }

    if (id && !topic) return (<div>加载中</div>)

    return (<form className="form" onSubmit={this.submit}>

      <div className={styles.avatar}>
        {updateButton}
        {/*topic && topic.avatar ? <img src={topic.avatar} /> : null*/}
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>名称</label>
        <div className="unit">
          <input type="text" ref="name" defaultValue={topic ? topic.name : ''} placeholder="名称"></input>
        </div>
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>简介</label>
        <div className="unit">
          <input type="text" ref="brief" defaultValue={topic ? topic.brief : ''} placeholder="简介"></input>
        </div>
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>详细描述</label>
        <div className="unit">
          <textarea styleName="description" ref="description" defaultValue={topic ? topic.description : ''} placeholder="详细描述"></textarea>
        </div>
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>分类</label>
        <div className="unit">
          <select ref="parentId" defaultValue={topic ? (topic.parent_id || '') : '-1'}>
            <option value="-1">请选择分类</option>
            <option value="">无父类</option>
            {topicList.data && topicList.data.map(item=>{
              return (<option key={item._id} value={item._id}>{item.name}</option>)
            })}
          </select>
        </div>
      </div>

      <button className="btn btn-primary">提交</button>

    </form>)

  }

}

EditTopic = CSSModules(EditTopic, styles)

export default Shell(EditTopic)
