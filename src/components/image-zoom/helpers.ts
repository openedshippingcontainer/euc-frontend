const toDurationString = (duration: number): string => `${duration}ms`

interface GetScale {
  height: number
  innerHeight: number
  innerWidth: number
  width: number
  zoomMargin: number
}

export const getScale = ({
  height,
  innerHeight,
  innerWidth,
  width,
  zoomMargin
}: GetScale): number => {
  const scaleX = innerWidth / (width + zoomMargin)
  const scaleY = innerHeight / (height + zoomMargin)
  const scale = Math.min(scaleX, scaleY)

  return scale
}

interface GetModalContentStyle {
  height: number
  innerHeight: number
  innerWidth: number
  isLoaded: boolean
  isUnloading: boolean
  left: number
  originalTransform: string | null
  top: number
  transitionDuration: number
  width: number
  zoomMargin: number
}

type GetModalContentStyleReturnType = {
  height: number
  left: number
  top: number
  transform: string
  WebkitTransform: string
  transitionDuration: string
  width: number
}

export const getModalContentStyle = ({
  height,
  innerHeight,
  innerWidth,
  isLoaded,
  isUnloading,
  left,
  originalTransform,
  top,
  transitionDuration,
  width,
  zoomMargin
}: GetModalContentStyle): GetModalContentStyleReturnType => {
  const transitionDurationString = toDurationString(transitionDuration)

  if (!isLoaded || isUnloading) {
    const initTransform = [
      `scale(1)`,
      `translate(0, 0)`,
      ...(originalTransform ? [originalTransform] : [])
    ].join(' ')

    return {
      height,
      left,
      top,
      transform: initTransform,
      WebkitTransform: initTransform,
      transitionDuration: transitionDurationString,
      width
    }
  }

  // Get amount to scale item
  const scale = getScale({
    height,
    innerWidth,
    innerHeight,
    width,
    zoomMargin
  })

  // Get the the coords for center of the viewport
  const viewportX = innerWidth / 2
  const viewportY = innerHeight / 2

  // Get the coords for center of the parent item
  const childCenterX = left + width / 2
  const childCenterY = top + height / 2

  // Get offset amounts for item coords to be centered on screen
  const translateX = (viewportX - childCenterX) / scale
  const translateY = (viewportY - childCenterY) / scale

  // Build transform style, including any original transform
  const transform = [
    `scale(${scale})`,
    `translate(${translateX}px, ${translateY}px)`,
    ...(originalTransform ? [originalTransform] : [])
  ].join(' ')

  return {
    height,
    left,
    top,
    transform,
    WebkitTransform: transform,
    transitionDuration: transitionDurationString,
    width
  }
}

interface GetModalOverlayStyle {
  isLoaded: boolean
  isUnloading: boolean
  overlayBgColorEnd: string
  overlayBgColorStart: string
  transitionDuration: number
  zoomZindex: number
}

type GetModalOverlayStyleReturnType = {
  backgroundColor: string
  transitionDuration: string
  zIndex: number
}

export const getModalOverlayStyle = ({
  isLoaded,
  isUnloading,
  overlayBgColorEnd,
  overlayBgColorStart,
  transitionDuration,
  zoomZindex
}: GetModalOverlayStyle): GetModalOverlayStyleReturnType => {
  const style = {
    backgroundColor: overlayBgColorStart,
    transitionDuration: toDurationString(transitionDuration),
    zIndex: zoomZindex
  };

  if (isLoaded && !isUnloading)
    style.backgroundColor = overlayBgColorEnd;

  return style;
}

// @TODO: test
// if parentRef.current is not available yet,
// we can fall back to these defaults
type GetBoundingClientRectReturnType = {
  height: number
  left: number
  top: number
  width: number
}

export const pseudoParentEl = {
  getBoundingClientRect: (): GetBoundingClientRectReturnType => ({
    height: 0,
    left: 0,
    top: 0,
    width: 0
  }),
  style: {
    transform: null
  }
}
