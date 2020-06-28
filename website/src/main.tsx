import React, { useState, useEffect, HtmlHTMLAttributes } from 'react'
import styled from 'styled-components'

import { meta } from '@animation-master/content'
import type { AnimationItem } from '@animation-master/content'
import { easeInOutBack } from './utils/easing'

const Wrapper = styled.main`
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
`

const Card = styled.div`
  position: relative;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 20px;
  overflow: hidden;

  & + & {
    margin-top: 20px;
  }
`

const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  position: relative;

  .item {
    width: 200px;
    padding: 10px;
    margin: 10px;
    border-radius: ${(props) => props.theme.borderRadius};
    background: #f7f9fbc9;
    overflow: hidden;
    transition: all 0.2s ${easeInOutBack};

    &:hover {
      transform: scale(1.1);
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    }
  }

  .thumbnail {
    border-radius: ${(props) => props.theme.borderRadius};
    width: 100%;
    object-position: center;
    object-fit: cover;
  }
`

const Item = ({
  item,
  ...rest
}: { item: AnimationItem } & React.HTMLAttributes<HTMLAnchorElement>) => {
  const [thumbnailSrc, setSrc] = useState('')

  useEffect(() => {
    const loadSrc = async () =>
      setSrc(
        (
          await import(
            /* webpackMode: eager */ '@animation-master/content/build/' +
              item.thumbnail
          )
        ).default
      )

    loadSrc()
  }, [])

  return (
    <a
      className="item"
      href={`./${item.path}`}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {thumbnailSrc && (
        <img
          className="thumbnail"
          src={thumbnailSrc}
          height="120"
          alt=""
          loading="lazy"
        />
      )}
      <h5 className="title">{item.title}</h5>
    </a>
  )
}

const BackgroundIframe = styled.iframe`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: unset;
  background: #e9b59f; // TODO extract color
  filter: blur(5px);
  z-index: 0;
`

const CollectionTitle = styled.h5`
  position: relative;
`

const Collection = () => {
  // TODO fix multiple collection preview
  const [backPreview, setPreview] = useState<string | null>()

  return (
    <>
      {meta.map((collection) => {
        return (
          <Card key={collection.name}>
            <BackgroundIframe
              src={backPreview ? `./${backPreview}` : undefined}
            ></BackgroundIframe>
            <CollectionTitle>{collection.name}</CollectionTitle>
            <ItemWrapper>
              {collection.item.map((item) => (
                <Item
                  item={item}
                  key={item.id}
                  onMouseEnter={() => setPreview(item.path)}
                  onMouseLeave={() => setPreview(null)}
                ></Item>
              ))}
            </ItemWrapper>
          </Card>
        )
      })}
    </>
  )
}

export const Main = () => (
  <Wrapper>
    {/* <div>Animation Master</div> */}

    <Collection />
  </Wrapper>
)
