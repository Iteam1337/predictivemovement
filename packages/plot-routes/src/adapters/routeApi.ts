import axios from 'axios'
import { routeApi } from '../config'

export default axios.create({ baseURL: routeApi })
