import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Icon from './Icon'

const CopyToClipboard = ({ text }) => {
    const [isCopied, setCopied] = useState(false)

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()

        navigator.clipboard.writeText(text)
        setCopied(true)

        setTimeout(() => setCopied(false), 600)
    }

    return (
        <OverlayTrigger
            overlay={<Tooltip>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</Tooltip>}
        >
            <span onClick={handleClick}>
                <Icon icon={`clipboard${isCopied ? '-check' : ''}`} />
            </span>
        </OverlayTrigger>
    )
}

export default CopyToClipboard