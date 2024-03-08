import React from 'react'

const Card = ({ imageLink }) => {
    return (
        <div>
            <img
                src={imageLink}
                alt=''
            />
        </div>
    )
}

export default Card