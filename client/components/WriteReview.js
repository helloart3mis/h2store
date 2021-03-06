import React, { Component } from 'react'
import { connect } from 'react-redux'
import { postReview, createReview, fetchSingleProduct } from '../store'
import { Redirect } from 'react-router-dom'
import history from '../history'

class WriteReview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitVisible: false,
      allFieldsPopulated: false,
    }
  }

  componentDidMount(){
    const {id} = this.props.match.params
    this.props.getProduct(id)
    this.handleChange = this.handleChange.bind(this)
    this.handleRedirect = this.handleRedirect.bind(this)
    if (this.props.userId) {
      this.setState({submitVisible: true})
    }
  }

  handleChange (event) {
    this.props.review[event.target.name] = event.target.value
    this.props.newReview(this.props.review)
  }

  handleRedirect (review, evt) {
    const { productId } = this.props
    if (!this.props.review.title || !this.props.review.stars || !this.props.review.message){
      evt.preventDefault()
      alert('Please populate all fields in the Review form.')
    } else {
      this.props.handleSubmit(review, evt)
      history.push(`/products/${productId}/reviews`)

    }
  }


  render (){
    const {review, productId, product, userId} = this.props
    if (productId && userId){
      review.productId = productId
      review.userId = userId
    }
    return (
      <div>
        <h3>{product.name}</h3>
        <h4>Write Your Review</h4>
        <form onSubmit={evt => this.handleRedirect(review, evt)}>
          <label htmlFor='title'>Title</label>
            <input
              value={review.title}
              type="text"
              name="title"
              onChange={this.handleChange}
              />
          <label htmlFor='stars'>Stars</label>
            <input
              value={review.stars}
              type="number" step='.1'
              name="stars"
              onChange={this.handleChange}
            />
          <label htmlFor='message'>Message</label>
            <textarea
              cols='50'
              rows='5'
              value={review.message}
              type="text"
              name="message"
              onChange={this.handleChange}
            />

          {
            this.state.submitVisible ?
            <button type="submit">
                Submit
              </button> :
              <button type="submit" disabled>
                  Submit
                </button>
          }
        </form>
        <hr />
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    productId: state.product.selectedProduct.id,
    product: state.product.selectedProduct,
    review: state.review,
    userId: state.user.id,
  }
}

const mapDispatch = function (dispatch) {
  return {
    getProduct (id) {
      dispatch(fetchSingleProduct(id))
    },
    handleSubmit (review, evt) {
      evt.preventDefault()
      dispatch(postReview(review))
      dispatch(createReview({}))
    },
    newReview (newreview) {
      dispatch(createReview(newreview))
    }
  }
}

export default connect(mapState, mapDispatch)(WriteReview)
