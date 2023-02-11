import { BsCardImage } from 'react-icons/bs'
import { AiOutlineLink, AiOutlineCloudUpload } from 'react-icons/ai'
import { FaYoutube } from 'react-icons/fa'
import { MdPermMedia } from 'react-icons/md'
import { Popover, Button, Text, Input, Modal, Divider, Loading } from "@nextui-org/react";
import { stateToHTML } from "draft-js-export-html";
import {stateFromHTML} from 'draft-js-import-html';
import { IoIosAdd } from 'react-icons/io'
import { UilSearch } from '@iconscout/react-unicons'
import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import createUndoPlugin from '@draft-js-plugins/undo';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createVideoPlugin from '@draft-js-plugins/video';

import htmlToDraft from "html-to-draftjs";

import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css'
import '@draft-js-plugins/undo/lib/plugin.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css'
import '@draft-js-plugins/inline-toolbar/lib/plugin.css'
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/text-alignment/lib/plugin.css'

import buttonStyles from './buttonStyles.module.css';
import toolbarStyles from './toolbarStyles.module.css';
import blockTypeSelectStyles from './blockTypeSelectStyles.module.css';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';

import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import { convertFromRaw, EditorState, AtomicBlockUtils, convertToRaw, ContentState } from 'draft-js';
import editorStyles from './editor.module.css';

import mockUpload from './mockUpload.js';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import moment from 'moment';
// import { AddMedia, GetAllMedia } from '@network/cm/media';
// import ImageContent from '@components/molecules/modal/showImage';
// import ShowCrashImage from '@components/atoms/crashImage';
// import ShowFilterMobile from '@components/molecules/showFilterMobile';
// import { InputSelect } from '@components/atoms/Input';
// import { SortingAs } from '@utils/constants/optionTable';
// import { useSelector } from 'react-redux';
// import InputFile from '@components/atoms/Input/inputFile';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const staticToolbarPlugin = createToolbarPlugin();
const sideToolbarPlugin = createSideToolbarPlugin({
  position: 'right',
  theme: { buttonStyles, toolbarStyles, blockTypeSelectStyles },
});
const undoPlugin = createUndoPlugin();
const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });
const linkPlugin = createLinkPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const hashtagPlugin = createHashtagPlugin();
const videoPlugin = createVideoPlugin();
const textAlignmentPlugin = createTextAlignmentPlugin();

const { UndoButton, RedoButton } = undoPlugin;
const { AlignmentTool } = alignmentPlugin;
const { Toolbar } = staticToolbarPlugin;
const { SideToolbar } = sideToolbarPlugin
const { InlineToolbar } = inlineToolbarPlugin;
const { types } = videoPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage,
});

const plugins = [
  dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  staticToolbarPlugin,
  sideToolbarPlugin,
  undoPlugin,
  linkifyPlugin,
  inlineToolbarPlugin, 
  linkPlugin,
  hashtagPlugin,
  videoPlugin,
  textAlignmentPlugin
];

// helper
const convertVideoTagEditorToContent = (html) => {
  
  if (html.includes(`<figure><video src=`)){
    
    // get list all video with slicing
    let listVideoLink = []
    html.split(`<figure><video src="`)?.forEach((html, idx) => {
      if (idx !== 0){
        let videoLink = html.split('">&nbsp;</video></figure>')[0]
        listVideoLink.push(videoLink)
      }
    })
    
    // replace all video
    listVideoLink?.forEach((item, idx) => {
      html = html.replace(`<figure><video src="${item}">&nbsp;</video></figure>`,  `<figure class="media"><oembed url=${item}></oembed></figure>`)
    })
  }

  return html
}

const convertVideoTagContentToEditor = html => {
  if (html?.includes(`<figure class="media"><oembed url=`)){

    // get list all video with slicing
    let listVideoLink = []
    html.split(`<figure class="media"><oembed url=`)?.forEach((html, idx) => {
      if (idx !== 0){
        let videoLink = html.split('></oembed></figure>')[0]
        listVideoLink.push(videoLink)
      }
    })

    // replace all video
    listVideoLink?.forEach((item, idx) => {
      html = html.replace(`<figure class="media"><oembed url=${item}></oembed></figure>`,  `<figure><video src="${item}">&nbsp;</video></figure>`)
    })

    // let videolink = html.split('<figure class="media"><oembed url=')?.[1]?.split('></oembed></figure>')?.[0]
    // let newVideoTag = `<figure><video src="${videolink}">&nbsp;</video></figure>`
    // html = html.replaceAll(`<figure class="media"><oembed url=${videolink}></oembed></figure>`, newVideoTag)  
  }
  return html
}


const convertHtmlToDraftjs = (htmlValue) => {
  const blocksFromHtml = htmlToDraft(htmlValue, (nodeName, node) => {
    
    if (nodeName === "video") {
      const entityConfig = {};
      entityConfig.src = node.getAttribute
        ? node.getAttribute("src") || node.src
        : node.src;
      entityConfig.alt = node.alt;
      entityConfig.height = node.style.height;
      entityConfig.width = node.style.width;
      if (node.style.float) {
        entityConfig.alignment = node.style.float;
      }

      const value = {
        type: types.VIDEOTYPE, // should similar to videoPlugin.type if use @draft-js-plugins/video
        mutability: "IMMUTABLE",
        data: entityConfig
      };
      return value;
    };
  });
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  const editorValue = EditorState.createWithContent(contentState);

  return editorValue;
};

const options = {
  inlineStyles: {
    center: {
      element: 'p',
      style: {
        textAlign: 'center'
      }
    },
    right: {
      element: 'p',
      style: {
        textAlign: 'right'
      }
    }
  },
  entityStyleFn: (entity) => {
    const entityType = entity.get('type').toLowerCase();
    if (entityType === 'image'){
      const data = entity.getData()
      let styles = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
      } 
      if (data?.width){
        styles['width'] = `${data?.width}%`
      }

      return {
        element: 'img',
        attributes: {
          src: data.src
        },
        style: styles
      }
    }else if (entityType === 'draft-js-video-plugin-video') {
        const data = entity.getData();
        return {
          element: 'video',
          attributes: {
            src: data.src,
          },
        };
    }else if (entityType === 'video'){
      const data = entity.getData();
        return {
          element: 'video',
          attributes: {
            src: data.src,
          },
        };
    }
      return null;
  },
};

const MyEditor = ({onChanges, disable, data, idx}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  
  useEffect(() => {
      var dataNow = convertVideoTagContentToEditor(data)
      var resContentThisEditor = stateToHTML(editorState.getCurrentContent(), options)
      if ( dataNow !== resContentThisEditor){
        if (data){
          dataNow = convertHtmlToDraftjs(dataNow);
          setEditorState(dataNow)  
        }
      }
      console.log(data)
      // console.log(data, ' <==== data')
      // console.log(resContentThisEditor, ' <=== res content')
      // let dataHtmlParent = convertVideoTagContentToEditor(data) 
      // console.log(dataHtmlParent, ' <===== data html to fomat html editor')
      // dataHtmlParent = convertHtmlToDraftjs(dataHtmlParent);
      // console.log(dataHtmlParent, ' <=== data html to draftjs')    
  },[data])

  
  
  const editorRef = useRef(null)

  // chance untuk video classOnline yang akan di convert
  // 
  // convert video to <figure class="media"><oembed url="https://www.youtube.com/watch?v=COhSLGKv0Sk&amp;"></oembed></figure>
  // from <figure><video src="https://www.youtube.com/watch?v=VpNaZHs3QM0&amp;list">&nbsp;</video></figure>

  const onChangeEditor = (editorState) => {
    // replace video klass online jika ada
    var resContent = stateToHTML(editorState.getCurrentContent(), options)
    resContent = convertVideoTagEditorToContent(resContent)
    onChanges(resContent)
    setEditorState(editorState)

  };

  // set height editr
  const csEditorContent = document.getElementsByClassName('public-DraftEditor-content')
  
  if (csEditorContent?.[0]){
    
    for (let i=0; i<= csEditorContent.length; i++){
      if (csEditorContent?.[i]){
        csEditorContent[i].style.minHeight = '10rem'
      }
    } 
  }
  function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: Media,
        editable: false,
      };
    }
  
    return null;
  }


  return (
    <NoSsr>
        
      <div className={`border-4`} >
        <Toolbar >
            {
              // may be use React.Fragment instead of div to improve perfomance after React 16
              (externalProps) => (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Fragment>
                      <BoldButton {...externalProps} />
                      <ItalicButton {...externalProps} />
                      <UnderlineButton {...externalProps} />
                      <CodeButton {...externalProps} />
                      <Separator {...externalProps} />
                      <textAlignmentPlugin.TextAlignment  {...externalProps} />
                      {/* <HeadlinesButton {...externalProps} /> */}
                      <UnorderedListButton {...externalProps} />
                      <OrderedListButton {...externalProps} />
                      <BlockquoteButton {...externalProps} />
                      <ImageAdd
                        editorState={editorState}
                        onChange={onChangeEditor}
                        modifier={imagePlugin.addImage}
                      />
                      {/* <VideoAdd 
                        editorState={editorState}
                        onChange={onChangeEditor}
                        modifier={imagePlugin.addImage}
                    /> */}
                    </Fragment>
                  </div>
                  <div className='flex items-center '>
                      <UndoButton />
                      <RedoButton />
                  </div>
                </div>
              )
            }
        </Toolbar>
        <div className='p-5 draftjsEditor' style={{ fontSize: '16px' }}>
          <Editor 
            editorState={editorState}
            onChange={onChangeEditor}
            plugins={plugins}
            ref={editorRef}
          />
        </div>
         {/* <AlignmentTool /> */}
      </div>
      
      
        <SideToolbar >
          {
              // may be use React.Fragment instead of div to improve perfomance after React 16
              (externalProps) => (
                <div className='grid grid-cols-2'>
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    
                </div>
              )
            }
        </SideToolbar>

        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <linkPlugin.LinkButton {...externalProps} />
              </div>
            )
          }
        </InlineToolbar>
    </NoSsr>
  )
}


// insert image
const ImageAdd = ({ editorState, onChange, modifier }) => {
  
  const [ uri, setUri ] = useState('')

  const insertImage = async (url=uri) => {
    const imagePlugin = createImagePlugin();
    const newEditorState = imagePlugin.addImage(editorState, url, {});
    onChange(newEditorState)
  };
  
  const [ allMediaImage, setAllMediaImage ] = useState([])
  const [ totalAllImage, setTotalAllImage ] = useState(null)
  const [ loadingLoadMoreMedia, setLoadingLoadMoreMedia ] = useState(false)
  const [ isOpenPopoverImage, setIsOpenPopoverMedia ] = useState(false)
  const [ showModalMedia, setShowModalMedia ] = useState(false)

  const [ imageByUrl, setImageByUrl ] = useState('')

  const [ cols, setCols ] = useState(4)
  const [ paramsGetMedia, setParamsGetMedia ] = useState({
    page: 1,
    limit: 20,
    search:'',
    sort:'',
    order:'',
    type: 1,
  })
  useEffect(() => {
    // GetAllMedia('/cm-media', paramsGetMedia)
    //   .then(res => {
    //     setTotalAllImage(res?.data?.Rows)
    //     setAllMediaImage(res?.data?.Data)
    //   }).catch(err => {})
  },[paramsGetMedia.order, paramsGetMedia.search, paramsGetMedia.sort, paramsGetMedia.type])
  
  const [ counterPageParams, setCounterPageParams ] = useState(2)
  const AppendDataImage = async () => {
    setLoadingLoadMoreMedia(true)
    // await GetAllMedia('/cm-media', {...paramsGetMedia, page: counterPageParams})
    //   .then(res => {
    //     setAllMediaImage([ ...allMediaImage ,...res?.data?.Data])
    //     setParamsGetMedia({ ...paramsGetMedia, page: counterPageParams })
    //     setCounterPageParams(counterPageParams+1)
    //   }).catch(err => {})
    setLoadingLoadMoreMedia(false) 
  }

  const refUploadFile = useRef(null)
  const refBtnTrigger = useRef(null)
  // type insert 
  // 1 = link
  // 2 = upload image
  // 3 = select from media
  const [ typeInsert, setTypeInsert ] = useState(1)
  
  const CloseButtonSelectFromMedia = () => {
    setShowModalMedia(false)
  }

  let sortByField = [
    { label: 'Description', value: 'media_desc' },
    { label: 'Created', value: 'created_at' },
    { label: 'Last Update', value: 'updated_at' },
  ]

  let Cols = [
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 }
  ]

  const HandleChangeParams = ( key, e ) => {
    setParamsGetMedia({ ...paramsGetMedia, [key]:e.target.value })
  }

  const UploadNewImage = async (e) => {
    // await AddMedia({
    //   MediaTypeId: 1,
    //   File: e.target.files[0],
    //   mediaDesc: '_',

    // })
    //   .then(res => {
    //     insertImage(res?.data?.Data?.MediaUrl)
    //     setIsOpenPopoverMedia(false)
    //   }).catch(err => {
    //     {}
    //   })
  }

  // let getScreen = useSelector((state) => state.screen.screen_type)
  // let isMobile = getScreen === 'mobile'
  
  return (
    <Fragment>
      
      <Modal
        open={showModalMedia}  
        closeButton
        onCloseButtonClick={CloseButtonSelectFromMedia}
        onClose={CloseButtonSelectFromMedia}
        width='60%'
        scroll={true}
        onScrollCapture={ async (e, u) => {
          var element = e.target;
          if (element.scrollHeight-5 < element.scrollTop + element.clientHeight && totalAllImage > allMediaImage?.length){
            AppendDataImage(counterPageParams)
          } 

        }}
      >
        <Modal.Header>
          <p className='text-lg font-semibold'>Select Image From Media</p>
        </Modal.Header>
        <Modal.Body>
          
          <div className='laptop:flex items-center space-x-4 mb-2'>
              <Input placeholder='Search desc' label='Search' name='search' size={1} icon={<UilSearch size={20} />} onChange={e => HandleChangeParams('search', e)} />
              {/* <ShowFilterMobile>
                  <InputSelect dataSelect={sortByField} getOptionLabel='label' getOptionValue='value' label='Sort' placeholder='Sort' onChange={e => HandleChangeParams('sort', e)} />
                  <InputSelect dataSelect={SortingAs} getOptionLabel='label' getOptionValue='value' label='Order' placeholder='ASC' onChange={e => HandleChangeParams('order', e)} />
              </ShowFilterMobile> */}
              {/* {!isMobile && (
                  <InputSelect dataSelect={Cols} getOptionLabel='label' getOptionValue='value' label='Col' placeholder='Col Grid' value={cols} onChange={e => setCols(e.target.value)} />
              )} */}
          </div>
          <div className={`grid grid-cols-${cols} gap-2 bg-gray-100 p-2 shadow border`}>
            {allMediaImage?.map((item, idx) => (
                <div key={idx} className='break-inside flex items-center justify-center' onClick={() => {
                  insertImage(item?.MediaUrl)
                  setShowModalMedia(false)
                }}>
                    {item.MediaUrl ? (
                      <p>image</p>
                        // <ImageContent image={item.MediaUrl} label={item.MediaDesc} onClicks={() => {}} />
                    ) : (
                        // <ShowCrashImage />
                        <p>crash image</p>
                    )}
                </div>
            ))}
            </div>
            <div className='w-full flex items-center justify-center mt-10 mb-20'>
              {loadingLoadMoreMedia && totalAllImage > allMediaImage?.length && (
                <Loading color='primary' size='md' />
              )}
            </div>
        </Modal.Body>
      </Modal>
      
      <div className={editorStyles.headlineButtonWrapper}>
            <Popover
              isOpen={isOpenPopoverImage}
              onClose={() => setIsOpenPopoverMedia(false)}
            >
              <Popover.Trigger>
                <div className={`${editorStyles.headlineButton} flex items-center justify-center`} onClick={() => setIsOpenPopoverMedia(!isOpenPopoverImage)}>
                  <BsCardImage />
                </div>
              </Popover.Trigger>
              <Popover.Content>
                <div className='bg-white'>
                    <div className='flex items-center' style={{ minWidth: '23rem' }}>
                      <div className='hover:bg-gray-100 p-2' onClick={() => setTypeInsert(1)}>
                        <AiOutlineLink size={20} color='gray' />
                      </div>
                      {/* <div className='hover:bg-gray-100 p-2' onClick={() => setTypeInsert(2)}>
                        <AiOutlineCloudUpload size={20} color='gray' />
                      </div> */}
                      {/* <div className='hover:bg-gray-100 p-2' onClick={() => {
                        setIsOpenPopoverMedia(false)
                        setShowModalMedia(true)
                      }}>
                        <MdPermMedia size={20} color='gray' />
                      </div> */}
                    </div>
                    <div className='p-2 border w-full flex items-center'>
                    {typeInsert === 1 ? (
                        <Fragment>
                          <Input 
                            clearable
                            underlined
                            placeholder='type external image link'
                            fullWidth
                            color="primary" 
                            onChange={e => setImageByUrl(e.target.value)}
                          />
                          <button className='bg-blue-500 py-1 px-2 cursor-pointer rounded text-white ml-2' onClick={() => {
                            insertImage(imageByUrl)
                            setIsOpenPopoverMedia(false)
                          }}>Submit</button>
                        </Fragment>
                        ) : typeInsert === 2 ? (
                          <div className='p-2 border border-gray-200 px-5 cursor-pointer' onClick={() => refUploadFile?.current?.click()}>
                            <IoIosAdd />
                            <p className='text-xs'>click to</p>
                            <p className='text-xs'>upload files</p>
                            <input type='file' className='hidden' ref={refUploadFile} onChange={UploadNewImage} />
                          </div>
                          ) : null}
                    </div>
                  </div>
              </Popover.Content>
          </Popover>
            
      </div>
    </Fragment>
  )
}

const VideoAdd = ({ editorState, onChange, modifier }) => {
  
  const [ uri, setUri ] = useState('')
  const [ openPopover, setOpenPopover ] = useState(false)

  const SaveVideo = async () => {
    const videoPlugin = createVideoPlugin()
    const newEditorState = videoPlugin.addVideo(editorState, { src: uri })
    onChange(newEditorState)
  };

  
  return (
    <div className={editorStyles.headlineButtonWrapper}>
        <div className={editorStyles.headlineButton}>
          <Popover isOpen={openPopover} onClose={() => setOpenPopover(false)}>
            <Popover.Trigger>
              <div className='h-full flex items-center justify-center cursor-pointer' onClick={() => setOpenPopover(true)}>
                <FaYoutube />
              </div>
            </Popover.Trigger>
            <Popover.Content>
            <div className='bg-white'>
                <div className='p-2 border w-96 flex items-center'>
                  <Input 
                    clearable
                    underlined
                    placeholder='type video link'
                    fullWidth
                    color="primary" 
                    onChange={e => setUri(e.target.value)}
                  />
                  <button className='bg-blue-500 py-1 px-2 cursor-pointer rounded text-white ml-2' onClick={() => {
                    SaveVideo()
                    setOpenPopover(false)
                  }}>Submit</button>
                </div>
              </div>
            </Popover.Content>
          </Popover>
            {/* <Popover 
              label={
                <div className='h-full flex items-center justify-center cursor-pointer' ref={refBtnTrigger}>
                    <FaYoutube />
                </div>
              }
              content={
                <div className='bg-white border'>
                  <div className='p-2 border w-full flex items-center'>
                    <Input 
                      className='border p-1'
                      style={{ width: '100%' }}
                      placeholder='youtube video link'
                      title='Url'
                      value={uri}
                      onChange={e => setUri(e.target.value)}
                      />
                      <Button variant='contained' size='small' className='p-2 w-20 mt-3' onClick={SaveVideo}>save</Button>
                  </div>
                </div>
              }
            /> */}
        </div>
      </div>
  )
}


class HeadlinesPicker extends React.Component{
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) => (
          // eslint-disable-next-line
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

class HeadlinesButton extends React.Component{
  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className={editorStyles.headlineButtonWrapper}>
        <button onClick={this.onClick} className={editorStyles.headlineButton}>
          H
        </button>
      </div>
    );
  }
}

const NoSsr = (props) => {
    const [mounted, setMounted] = useState(false);
    useEffect(()=>{
      setMounted(true);
    }, [])
    return <>
      { mounted ? props.children : null }
    </>
  }
export default MyEditor