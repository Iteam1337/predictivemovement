import { CompositeLayer } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'

const getIconName = (size) => {
  if (size === 0) {
    return ''
  }
  if (size === 1) {
    return 'marker'
  }
  if (size < 10) {
    return `marker-${size}`
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 10)}0`
  }
  return 'marker-100'
}

const getIcon = (size, active, iconMapping) => {
  const iconName = getIconName(size)

  if (iconName && active && iconMapping) {
    const activeIconName = iconName + '-active'

    return iconMapping[activeIconName] ? activeIconName : iconName
  }

  return iconName
}

const getIconSize = (size, active) =>
  Math.min(100, active ? size + 100 : size) / 100 + 1

export default class IconClusterLayer extends CompositeLayer {
  shouldUpdateState({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState({ props, oldProps, changeFlags }) {
    const rebuildIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale

    if (rebuildIndex) {
      const index = new Supercluster({
        maxZoom: 16,
        radius: props.sizeScale,
        initial: () => ({
          active: false,
          color: [255, 255, 255, 100],
          activeIconAtlas: false,
        }),
        map: (props) => ({
          active: props.active,
          color: props.color,
          activeIconAtlas: props.activeIconAtlas,
        }),
        reduce: (prev, curr) => {
          prev.active = prev.active || curr.active
        },
      })

      index.load(
        props.data.map((d) => ({
          geometry: { coordinates: props.getPosition(d) },
          properties: d,
        }))
      )
      this.setState({ index })
    }

    const z = Math.floor(this.context.viewport.zoom)
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z,
      })
    }
  }

  getPickingInfo({ info, mode }) {
    const pickedObject = info.object?.properties

    if (!pickedObject) return info

    if (pickedObject.cluster && mode !== 'hover') {
      return {
        ...info,
        object: pickedObject,
        objects: this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map((f) => f.properties),
      }
    }

    return { ...info, object: pickedObject }
  }

  renderLayers() {
    const { data } = this.state
    const {
      iconAtlas,
      iconMapping,
      sizeScale,
      getColor,
      transitions,
    } = this.props

    return new IconLayer(
      this.getSubLayerProps({
        id: 'icon',
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getColor,
        transitions,
        getPosition: (d) => d.geometry.coordinates,
        getIcon: (d) =>
          getIcon(
            d.properties.cluster ? d.properties.point_count : 1,
            d.properties.active,
            iconMapping
          ),
        getSize: (d) =>
          getIconSize(
            d.properties.cluster ? d.properties.point_count : 1,
            d.properties.active
          ),
      })
    )
  }
}
