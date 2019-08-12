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
import {NewItem} from '../../newitem/new-item'
import {InformalProductsTable} from '../../../react-component/informal-products/informal-upload-table'
const user = require('../../../component/singletons/user-instance')
const Upload = require('../../../js/model/Upload.js')
import withListenTo from '../../../react-component/container/backbone-container'


class NewItemManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'new item',
      selectedMetacardType: undefined,
      files: [],
      uploads: [],
    }

    this.change = this.change.bind(this)
    this.cancelUpload = this.cancelUpload.bind(this)
    this.initializeUploadListeners = this.initializeUploadListeners.bind(this)
    this.initializeUploadListeners()
  }

  initializeUploadListeners() {
    const uploads = user
      .get('user')
      .get('preferences')
      .get('uploads')

    this.props.listenTo(uploads, 'change', this.change)
  }

  getFileModels(uploadPayload) {
    try{
      console.log(uploadPayload)
      return uploadPayload.attributes.uploads.models
        .map( model => { 
          const fileModel = model.attributes.file
          if(fileModel.status === 'uploading') {
            fileModel.status = 'Stop'
            fileModel.onClick = uploadPayload.cancel.bind(uploadPayload)
          }
          return fileModel
        })
    }

    catch(err){
      console.error(err);
      return;
    }
    
  }

  componentDidMount () {
    //setInterval(this.cancelUpload, 1000)
  }

  cancelUpload() {
    console.log("canceling")
    // if(this.state.uploads.length!=0){
    //   const upload = this.state.uploads[0]
    //   upload.cancel()
    // }
  }

  change(uploadPayload) {
    this.setState(
      {
        files: this.getFileModels(uploadPayload),
        uploads: uploadPayload
      }
    )    
  }

  handleViewUpdate(newView) {
    this.setState({
      currentView: newView
    });
  }

  setSelectedMetacardType(card) {
    this.setState({
      selectedMetacardType: card
    })
  }

  getCurrentView() {
    return (<NewItem files={this.state.files}/>)
  }

  render() {
    return( 
      this.getCurrentView() 
    )
  }
}

export default withListenTo(NewItemManager)

// module.exports = TabsView.extend({ 
//   className: 'is-list-add',
//   setDefaultModel(options) {
//     this.model = new ListAddTabsModel()
//   },
//   initialize(options) {
//     this.setDefaultModel(options)

//     TabsView.prototype.initialize.call(this)
//     this.model.set('activeTab', 'Import')
//   },
//   determineContent() {
//     const ActiveTab = this.model.getActiveView()
//     if (this.model.attributes.activeTab === 'Import') {
//       this.tabsContent.show(
//         new ActiveTab({
//           isList: true,
//           extraHeaders: this.options.extraHeaders,
//           url: this.options.url,
//           handleUploadSuccess: this.options.handleUploadSuccess,
//         })
//       )
//     } else {
//       this.tabsContent.show(
//         new ActiveTab({
//           handleNewMetacard: this.options.handleNewMetacard,
//           close: this.options.close,
//           model: this.model,
//         })
//       )
//     }
//   },
// })
