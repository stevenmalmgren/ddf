/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import  React, { useState } from 'react'
import styled from '../../react-component/styles/styled-components'

const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const Root = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 9;
    height: ${props => props.theme.minimumLineSize};
`

const Background = styled.div`
    height: 50%;
    background: ${props => props.theme.backgroundAccentContent};
    box-shadow: inset 0px 1px 1px 1px rgb(11, 24, 33);
    border-radius: calc(${props => props.theme.minimumLineSize} / 4);
    width: 100%;
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
    flex-grow: 1;
    line-height: ${props => props.theme.minimumLineSize};
    padding-left: ${props => props.theme.minimumSpacing};
    color: ${props => props.theme.primaryColor};
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

const ProgressBarWithText = (props) => {
    const {progress, message, messageOnClick} = props
    return (
        <StatusContainer>
            { progress ? <ProgressBar progress={progress} /> : <div></div>}
            <Line onClick={messageOnClick}>{message}</Line>
        </StatusContainer>
    )
}

export {ProgressBar, ProgressBarWithText}