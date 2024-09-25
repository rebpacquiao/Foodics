import axios from 'axios'

const getPosts = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const getPostComment = async (id: number) => {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export { getPosts, getPostComment }
