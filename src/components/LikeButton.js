import React, { PropTypes } from 'react'
import classnames from 'classnames'

const thumbsUp = ['👍🏽','👍🏾','👍🏿','👍','👍🏻','👍🏼']

const LikeButton = ({ userLiked, numLikes, handleClick, id }) => (
  <div className="like">
    <div className={classnames({
      numLikes: true,
      userLiked,
    })}>
      {numLikes}
    </div>
    <button className="likeTodo"
      onClick={() => handleClick(id)} >{thumbsUp[numLikes % thumbsUp.length]}</button>
  </div>
)

LikeButton.propTypes = {
  userLiked: PropTypes.bool.isRequired,
  numLikes: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default LikeButton
