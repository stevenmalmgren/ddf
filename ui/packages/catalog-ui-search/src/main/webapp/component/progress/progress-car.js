import  React, { useState } from 'react'

import styled from '../../react-component/styles/styled-components'


const Root = styled.div`
    display: flex;
    height: ${props => props.theme.minimumLineSize};
    align-items: center;
`

const Background = styled.div`
    height: 50%;
    width: 100%;
    background: ${props => props.theme.backgroundAccentContent};
    box-shadow: inset 0px 1px 1px 0px rgb(11, 24, 33);
    border-radius: calc(${props => props.theme.minimumLineSize} / 4);
`

const Foreground = styled.div`
    width: ${props => props.width}%;
    height: 100%;
    background: rgba(0,0,0,0.75);
    line-height: ${props => props.theme.minimumLineSize};
    vertical-align: middle;
    border-radius: calc(${props => props.theme.minimumLineSize} / 2);
`

const Line = styled.div`
    line-height: ${props => props.theme.minimumLineSize};
`

const ProgressBar = (props) => {
    const { progress } = props
    return (
        <Root>
            <Background>
                <Foreground width={progress} />
            </Background>
        </Root>
    ) 
}

module.exports = ProgressBar

