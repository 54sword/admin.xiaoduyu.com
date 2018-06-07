import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { addTopic, updateTopic, loadTopics, loadTopicById } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import Shell from '../shell'
import Meta from '../../components/meta'
import QiniuUploadImage from '../../components/qiniu-upload-image'
import avatarPicker from '../../vendors/avatar-picker'

class TopicForm extends Component {

  static mapStateToProps = (state, props) => {

    let obj = {
      topicList: getTopicListByName(state, 'topic-form-page')
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
      avatar: ''
    }
    this.submit = this.submit.bind(this)
    this.upload = this.upload.bind(this)
  }

  async componentDidMount() {

    const { id } = this.props.match.params
    const { loadTopics, topicList, loadTopicById } = this.props

    if (!topicList.data || topicList.data.length == 0) {
      await loadTopics({
        name: 'topic-form-page',
        filters: {
          variables: {
            type: 'parent',
            page_number: 1,
            page_size: 1000
          },
          select: `
            _id
            name
          `
        }
      })
    }

    // 编辑状态，加载id
    if (id) {
      let res = await loadTopicById({ id })
      if (res && res.data && res.data.topics && res.data.topics[0]) {
        this.state.avatar = res.data.topics[0].avatar
      }
    }

    this.setState({
      updateButton: <QiniuUploadImage upload={this.upload} multiple={false} name={'上传社群封面'} />
    })

  }

  upload(url) {

    const self = this

    avatarPicker({
      img: url,
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: () => {},
      done: p => {
        self.setState({
          avatar: url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"
        })
      }
    })

  }

  async submit(event) {

    if (event) event.preventDefault()

    const { addTopic, updateTopic, topic } = this.props
    const { name, brief, description, parentId, sort, recommend } = this.refs
    const { avatar } = this.state
    const { id } = this.props.match.params

    if (!avatar) return alert('请上传社群封面')
    if (!name.value) return name.focus()
    if (!brief.value) return brief.focus()
    if (!description.value) return description.focus()
    if (parentId && parentId.value == -1) return alert('请选择分类')

    let data = {
      avatar: avatar,
      name: name.value,
      brief: brief.value,
      description: description.value,
      sort: parseInt(sort.value),
      recommend: recommend.value ? true : false
    }

    if (parentId && parentId.value) {
      data.parent_id = parentId.value
    }

    // 更新
    if (topic) {

      data._id = id

      let [ err, res ] = await updateTopic({ data })

      if (res && res.data.updateTopic.success) {

        Toastify({
          text: "更新成功",
          duration: 6000,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast();

        this.context.router.history.goBack()

      }
      /*
      else if (err) {

        Toastify({
          text: res.error,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();

      }
      */
    } else {
      await addTopic({ filters: data });
      Toastify({
        text: "更新成功",
        duration: 6000,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      }).showToast();
      this.context.router.history.goBack()
    }

    return false

  }

  render() {

    let { topicList, topic } = this.props
    let { updateButton, avatar } = this.state

    // 编辑状态
    const { id } = this.props.match.params

    if (topic && topic.data && topic.data.length > 0) {
      topic = topic.data[0]
    } else {
      topic = null
    }

    if (id && !topic) {
      return '加载中'
    }

    console.log(topic);

    return (<div>
      <Meta meta={{title:topic ? '编辑话题' : '添加话题'}} />
      <form onSubmit={this.submit}>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">话题头像</label>
          <div className="col-sm-10">
            <div styleName="avatar">
              {updateButton}
              {avatar ? <img src={avatar} /> : null}
              {/*topic && topic.avatar ? <img src={topic.avatar} /> : (avatar ? <img src={avatar} /> : null)*/}
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">名称</label>
          <div className="col-sm-10">
            <input className="form-control" type="text" ref="name" defaultValue={topic ? topic.name : ''} placeholder="名称"></input>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">简介</label>
          <div className="col-sm-10">
            <input className="form-control" type="text" ref="brief" defaultValue={topic ? topic.brief : ''} placeholder="简介"></input>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">详细描述</label>
          <div className="col-sm-10">
            <textarea className="form-control" styleName="description" ref="description" defaultValue={topic ? topic.description : ''} placeholder="详细描述"></textarea>
          </div>
        </div>

        {!topic || topic.parent_id ?
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">分类</label>
            <div className="col-sm-10">
              <select className="form-control" ref="parentId" defaultValue={topic ? (topic.parent_id ? topic.parent_id._id : '') : '-1'}>
                <option value="-1">请选择分类</option>
                {topic ? null : <option value="">无父类</option>}
                {topicList.data && topicList.data.map(item=>{
                  return (<option key={item._id} value={item._id}>{item.name}</option>)
                })}
              </select>
            </div>
          </div>
        : null}

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">排序</label>
          <div className="col-sm-10">
            <input className="form-control" type="text" ref="sort" defaultValue={topic ? topic.sort : 0} placeholder="排序"></input>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">推荐</label>
          <div className="col-sm-10">
            <select className="form-control" ref="recommend" defaultValue={topic ? (topic.recommend ? 1 : '') : ''}>
              <option value="">否</option>
              <option value="1">是</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label"></label>
          <div className="col-sm-10">
            <button className="btn btn-primary">提交</button>
          </div>
        </div>

      </form>
    </div>)

  }

}

TopicForm.contextTypes = {
  router: PropTypes.object.isRequired
}

TopicForm = CSSModules(TopicForm, styles)

export default Shell(TopicForm)
