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
import React, { useState } from 'react'
import { storiesOf, number, text } from '../storybook'
import { InformalProductsTable } from './informal-upload-table'
import { ProgressBar, ProgressBarWithText } from './progress-car'

const stories = storiesOf('Informal Products', module)

stories.add('progress bar', () => {
  const progress = number('Progress Amount', 50)
  return <ProgressBar progress={progress} />
})

stories.add('progress bar with text', () => {
  const progress = number('progress amount', 74)
  const message = text('message', 'Stop')
  return <ProgressBarWithText progress={progress} message={message} />
})

stories.add('uploads table', () => {
  const uploads = [
    {
      onClick: () => alert('Message clicked!'),
      text: 'Stop',
      file: {
        name: 'Document 1',
        fileType: 'JIF LOREM EPSO DO DA UNUM',
        upload: {
          progress: 40,
        },
        message: '',
      },
    },
    {
      onClick: () => alert('Message clicked!'),
      text: 'Stop',
      file: {
        name: 'Document 2: JIF RELOADED',
        type: 'NEO',
        upload: {
          progress: 40,
        },
        message: '',
      },
    },
    {
      onClick: () => alert('Message clicked!'),
      text: 'Stop',
      file: {
        name: 'Document 3: Back to the .ttf',
        type: 'ttf',
        upload: {
          progress: 40,
        },
        message: '',
      },
    },
  ]

  return <InformalProductsTable uploads={uploads} />
})
