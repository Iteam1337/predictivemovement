import axios from 'axios'
import { osrm } from '../config'

export default axios.create({ baseURL: osrm })
