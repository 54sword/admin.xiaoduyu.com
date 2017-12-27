
import merge from 'lodash/merge'

let initialState = {
  other: {
    data: []
  }
}

export default function comment(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_COMMENT_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'SET_COMMENT':
      return merge({}, action.state, {})

    case 'ADD_COMMENT':
      var { comment } = action
      state.other.data.push(comment)
      return merge({}, state, {})

    case 'UPLOAD_COMMENT_LIKE_STATUS':
      var { id, status } = action

      for (let i in state) {

        state[i].data.map(item=>{
          if (item._id == id) {
            item.like_count += status ? 1 : -1
            item.like = status
          }

          item.reply.map(item=>{
            if (item._id == id) {
              item.like_count += status ? 1 : -1
              item.like = status
            }
          })

        })
      }

      return merge({}, state, {})

    default:
      return state;
  }
}

export const getCommentListByName = (state, name) => {
  return state.comment[name] ? state.comment[name] : {}
}

export const getCommentById = (state, id) => {

  let commentList = state.comment

  // if (commentList[id]) return commentList[id].data

  for (let i in commentList) {
    let list = commentList[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return [list[n]]
      }
    }
  }

  return []

}
