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
// const TabsView = require('../tabs.view')
// const ListAddTabsModel = require('./tabs-list-add')
import * as React from 'react'
import styled from 'styled-components'
import { NewItem } from '../../newitem/new-item'
import AttributeEditor from '../../tabs/list-add/attribute-editor'
import { InformalProductsTable } from '../../../react-component/informal-products/informal-upload-table'
import withListenTo from '../../../react-component/backbone-container'
import { BottomBar } from './bottom-bar'
const $ = require('jquery')
const user = require('../../../component/singletons/user-instance')
const metacardDefinitions = require('../../singletons/metacard-definitions')

const LightBoxContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid green;
  display: flex;
  flex-flow: column;
`

const AttributeEditorView = styled.div`
  display: flex;
  overflow-y: scroll;
  flex-grow: 9;
  height: 100%;
  margin: 16px;
`

const ButtonStyle = styled.div`
  padding: 0px ${props => props.theme.minimumSpacing};
  min-width: ${props => props.theme.minimumButtonSize};
  background-color: ${props => props.theme.primaryColor};
  align-self: center;
`

const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1)

class NewItemManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentView: 'new item',
      selectedMetacardType: 'common',
      currentBatch: undefined,
      addedUploads: undefined,
      uploads: [],
      informalBottomText: 'Starting',
      manualMetacard: undefined,
    }

    this.initializeUploadListeners = this.initializeUploadListeners.bind(this)
    this.getInformalBottomText = this.getInformalBottomText.bind(this)
    this.createManualMetacard = this.createManualMetacard.bind(this)
    this.onAttributeEdit = this.onAttributeEdit.bind(this)
    this.onManualSubmit = this.onManualSubmit.bind(this)
    this.cancelUploads = this.cancelUploads.bind(this)
    this.change = this.change.bind(this)
    this.add = this.add.bind(this)
  }

  initializeUploadListeners() {
    const uploads = user
      .get('user')
      .get('preferences')
      .get('uploads')

    this.props.listenTo(uploads, 'add', this.add)
  }

  add(addedUploads) {
    this.cancelUploads()
    addedUploads.attributes.uploads.models.map(model => {
      const fileModel = model.attributes.file
      return fileModel
    })
    this.setState({
      addedUploads,
    })
    this.props.listenTo(this.state.addedUploads, 'change', this.change)
    this.props.setInformalView()
  }

  change(uploadPayload) {
    if (uploadPayload.attributes.uploads.models.length <= 0) {
      this.props.setNewItemView()
    }

    this.setState({
      uploads: this.getFileModels(uploadPayload),
      informalBottomText: this.getInformalBottomText(uploadPayload),
    })
  }

  getInformalBottomText(uploadPayload) {
    const progressText = `${uploadPayload.attributes.complete} 
                          of ${uploadPayload.attributes.amount} items uploaded.`

    let errorText = ''
    if (uploadPayload.attributes.errors > 0) {
      errorText = `${uploadPayload.attributes.errors} failed.`
    }

    let issueText = ''
    if (uploadPayload.attributes.issues > 0) {
      issueText = `${uploadPayload.attributes.issues} issues.`
    }

    return progressText + ' ' + errorText + ' ' + issueText
  }

  componentDidMount() {
    this.initializeUploadListeners()
  }

  componentWillUnmount() {
    this.cancelUploads()
  }

  cancelUploads() {
    if (this.state.addedUploads !== undefined) {
      this.state.addedUploads.cancel()
      this.props.stopListening(this.state.addedUploads)
    }
  }

  getFileModels(uploadPayload) {
    return uploadPayload.attributes.uploads.models.map(model => {
      let uploadContainer = {}
      uploadContainer.text = capitalize(model.attributes.file.status)
      if (model.attributes.file.status === 'uploading') {
        uploadContainer.onClick = model.cancel.bind(model)
        uploadContainer.text = 'Stop'
      } else if (model.attributes.file.status === 'error') {
        uploadContainer.text = 'Failed'
      } else if (model.attributes.file.status === 'success') {
        uploadContainer.text = 'Completed'
      }
      uploadContainer.file = model.attributes.file
      return uploadContainer
    })
  }

  onAttributeEdit(editedMetacard) {
    this.setState({
      manualMetacard: editedMetacard,
    })
  }

  onManualSubmit(selectedMetacardType) {
    this.setState({
      selectedMetacardType,
    })
    this.props.setManualCreateAsView()
  }

  createManualMetacard() {
    const editedMetacard = this.state.manualMetacard
    const metacardType = this.state.selectedMetacardType

    const metacardDefinition =
      metacardDefinitions.metacardDefinitions[metacardType]

    const properties = editedMetacard.properties
    editedMetacard.properties = Object.keys(editedMetacard.properties)
      .filter(attributeName => properties[attributeName].length >= 1)
      .filter(attributeName => properties[attributeName][0] !== '')
      .reduce(
        (accummulator, currentValue) =>
          _.extend(accummulator, {
            [currentValue]: metacardDefinition[currentValue].multivalued
              ? properties[currentValue]
              : properties[currentValue][0],
          }),
        {}
      )

    editedMetacard.properties['metacard-type'] = metacardType
    editedMetacard.type = 'Feature'

    $.ajax({
      type: 'POST',
      url: './internal/catalog/?transform=geojson',
      data: JSON.stringify(editedMetacard),
      dataType: 'text',
      contentType: 'application/json',
    }).then((response, status, xhr) => {
      const id = xhr.getResponseHeader('id')
      if (id) {
        this.props.handleNewMetacard(id)
      }
    })
  }

  getCurrentView() {
    switch (this.props.currentView) {
      case 'new item':
        return (
          <NewItem
            onManualSubmit={this.onManualSubmit}
            handleUploadSuccess={this.props.handleUploadSuccess}
            url={this.props.url}
            extraHeaders={this.props.extraHeaders}
          />
        )
      case 'manual upload':
        const addButton = (
          <ButtonStyle>
            <button onClick={this.createManualMetacard}>{'Add item'}</button>
          </ButtonStyle>
        )
        return (
          <LightBoxContainer>
            <AttributeEditorView>
              <AttributeEditor
                metacardType={this.state.selectedMetacardType}
                onAttributeEdit={this.onAttributeEdit}
              />
            </AttributeEditorView>
            <BottomBar children={[addButton]} />
          </LightBoxContainer>
        )
      case 'informal table':
        const viewItemsButton = (
          <ButtonStyle>
            <button onClick={this.props.closeModal}>{'View items'}</button>
          </ButtonStyle>
        )

        return (
          <LightBoxContainer>
            <InformalProductsTable uploads={this.state.uploads} />
            <BottomBar
              bottomBarText={this.state.informalBottomText}
              children={[viewItemsButton]}
            />
          </LightBoxContainer>
        )
    }
  }

  render() {
    return this.getCurrentView()
  }
}

export default withListenTo(NewItemManager)
