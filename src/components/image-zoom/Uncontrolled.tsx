import "focus-options-polyfill";
import React, {
  FC,
  ReactNode,
  RefObject,
  StrictMode,
  memo,
  useCallback,
  useRef,
  useState
} from "react"
import UncontrolledActivated from "./UncontrolledActivated";
import { WrapElement } from "./Components";

interface Props {
  children: ReactNode
  closeText?: string
  openText?: string
  overlayBgColorEnd?: string
  overlayBgColorStart?: string
  portalEl?: HTMLElement
  scrollableEl?: HTMLElement | Window
  transitionDuration?: number
  zoomMargin?: number
  zoomZindex?: number
}

const Uncontrolled: FC<Props> = ({
  children,
  closeText = "Izumiraj sliku",
  overlayBgColorEnd = "rgba(255, 255, 255, 0.95)",
  overlayBgColorStart = "rgba(255, 255, 255, 0)",
  portalEl,
  openText = "Zumiraj sliku",
  scrollableEl,
  transitionDuration = 300,
  zoomMargin = 0,
  zoomZindex = 2147483647
}: Props) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isChildLoaded, setIsChildLoaded] = useState<boolean>(false)
  const wrapRef = useRef<HTMLElement>(null)

  const handleClickTrigger = useCallback(
    e => {
      if (!isActive) {
        e.preventDefault()
        setIsActive(true)
      }
    },
    [isActive]
  )

  const handleChildLoad = useCallback(() => {
    setIsChildLoaded(true)
  }, [])

  const handleChildUnload = useCallback(() => {
    setIsActive(false)
    setIsChildLoaded(false)

    if (wrapRef.current) {
      wrapRef.current.focus({ preventScroll: true })
    }
  }, [])

  return (
    <StrictMode>
      <WrapElement
        $isExpanded={isActive && isChildLoaded}
        aria-label={openText}
        onClick={handleClickTrigger}
        // @ts-ignore
        ref={wrapRef as RefObject<HTMLElement>}
      >
        {children}
        {(window !== undefined && isActive) ? (
          <UncontrolledActivated
            closeText={closeText}
            onLoad={handleChildLoad}
            onUnload={handleChildUnload}
            overlayBgColorEnd={overlayBgColorEnd}
            overlayBgColorStart={overlayBgColorStart}
            parentRef={wrapRef}
            portalEl={portalEl}
            scrollableEl={scrollableEl}
            transitionDuration={transitionDuration}
            zoomMargin={zoomMargin}
            zoomZindex={zoomZindex}
          >
            {children}
          </UncontrolledActivated>
        ) : null}
      </WrapElement>
    </StrictMode>
  )
}

export default memo(Uncontrolled)
