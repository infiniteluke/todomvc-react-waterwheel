import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

export default class LikeButton extends Component {
  static propTypes = {
    userLiked: PropTypes.bool.isRequired,
    numLikes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
  }

  render() {
    const { userLiked, numLikes, handleClick, id } = this.props
    return (
      <div className="like">
        <div className={classnames({
          numLikes: true,
          userLiked,
        })}>
          {numLikes}
        </div>            
        <button className="likeTodo"
          onClick={() => handleClick(id)} >👍🏾</button>
      </div>
    )
  }
}
