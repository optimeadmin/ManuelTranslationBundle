import React, { useId, useState } from 'react'
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
import Icon from './Icon'

const CopyToClipboard = ({ text }) => {
  const [isCopied, setCopied] = useState(false)
  const containerId = useId()
  const canCopy = !!navigator.clipboard

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (canCopy) {
      navigator.clipboard.writeText(text)
      setCopied(true)

      setTimeout(() => setCopied(false), 600)
    } else {
      setTimeout(() => selectText(containerId), 100)
    }
  }

  const renderTooltip = () => (
    <Tooltip>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</Tooltip>
  )

  const renderPopover = () => (
    <Popover onClick={e => e.stopPropagation()}>
      <Popover.Body id={containerId}>{text}</Popover.Body>
    </Popover>
  )

  return (
    <OverlayTrigger
      overlay={canCopy ? renderTooltip() : renderPopover()}
      trigger={canCopy ? ['hover', 'focus'] : 'click'}
      rootClose
    >
      <span onClick={handleClick}>
        <Icon icon={`clipboard${isCopied ? '-check' : ''}`}/>
      </span>
    </OverlayTrigger>
  )
}

const selectText = (containerId) => {
  // Copiado de internet
  if (document.selection) { // IE
    var range = document.body.createTextRange()
    range.moveToElementText(document.getElementById(containerId))
    range.select()
  } else if (window.getSelection) {
    var range = document.createRange()
    range.selectNode(document.getElementById(containerId))
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
  }
}

export default CopyToClipboard
