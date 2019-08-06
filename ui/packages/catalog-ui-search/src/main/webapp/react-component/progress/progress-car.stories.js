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


import { storiesOf, number, text } from '../storybook'

import { ProgressBar, ProgressBarWithText } from './progress-car'

import { ItemCreationTable } from './upload-card'


const stories = storiesOf('ProgressBar', module)

stories.add('basic', () => {
    const progress = number('Progress Amount', 50)
    return (
        <ProgressBar progress={progress} />
    )
})

stories.add('inline with text', () => {
    const progress = number('Progress Amount', 50)
    const message = text('Message', 'Stop')
    return (
        <ProgressBarWithText progress={progress} message={message}/>
    )
})

stories.add('uploads table', () => {
    const progress = number('Progress Amount', 50)
    const message = text('Message', 'Stop')
    return (
        <ItemCreationTable progress={progress} message={message} uploads={[
            {title: 'Document 1',
             fileType: 'PDF',
             progress: 60,
             message: 'Stop'},
             {title: 'Document 2',
             fileType: 'JPEG',
             message: 'Failed Try Again?'}
        ]}/>
    )
})