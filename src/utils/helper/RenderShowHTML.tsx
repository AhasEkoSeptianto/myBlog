import { Fragment  } from 'react'
import { CodeBlock , dracula  } from "react-code-blocks";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const RenderShowHTML = (content:any) => {

    let splitContent = content?.split('\n')
    

    // satukan code jika split setlahnya ada
    let listArr :any = {}
    splitContent?.forEach((item:any, idx:number) => {
        if (item?.includes('<code>')){
            listArr[idx] = item
        }   
    })

    let res:any = []
    let resToJoin = ''
    let keyBefore:any = null
    Object.keys(listArr)?.forEach((item, idx) => {
        if (idx === 0) {
            keyBefore = item
            resToJoin = resToJoin + listArr[item] + '\n'
        }else{
            if ((parseInt(item) -   1)?.toString() === keyBefore){
                resToJoin = resToJoin + listArr[item] + '\n'
                keyBefore = item
                
                if (idx +1 === Object.keys(listArr)?.length){
                    res.push(resToJoin)
                }

            }else{
                keyBefore = item
                res.push(resToJoin)
                resToJoin = ''
            }
        }

    })



    // console.log(res, '<=== result')
    let updated:any = []
    let idxRes = 0;
    let joining = ''
    splitContent?.map((item:any, idx:number) => {
        if (item?.includes('<code>') && splitContent[idx - 1]?.includes('<code>')){
            joining = joining  + res[idxRes]
            if ((item?.includes('<code>' && !splitContent?.[idx + 1]?.includes('<code>'))) || (idx + 1 === splitContent?.length)){
                updated.push(joining)
                joining = ''
            }
            idxRes = idxRes + 1
        }else if (item?.includes('<code>')){
            // joining = joining + res[idxRes]
        } else{
            updated.push(item)
        }
    })

    console.log(updated)



    return (
        <Fragment>
        {updated?.map((html:any, idx: any) => {
            if (html?.includes('<code>')){
                // html = html?.substring(0, html?.length-11)?.slice(9);
                return (
                    <CodeBlock  
                        text={html?.replaceAll(`<p><code>`, '')?.replaceAll('</code></p>', '')}
                        // language='js'
                        // theme={dracula}
                        showLineNumbers
                    />
                    
                )
            }else{
                return <div dangerouslySetInnerHTML={{ __html: html }}></div>
            }
        })}
        </Fragment>
    )
}