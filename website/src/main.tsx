import React, { useState, useEffect } from 'react'
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
  border-radius: ${(props) => props.theme.borderRadius};
  background: #fff;
  padding: 20px;

  & + & {
    margin-top: 20px;
  }
`

const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;

  .item {
    width: 200px;
    padding: 10px;
    margin: 10px;
    border-radius: ${(props) => props.theme.borderRadius};
    background: ${(props) => props.theme.background};
    overflow: hidden;
    transition: all 0.2s ${easeInOutBack};

    &:hover {
      transform: scale(1.1);
    }
  }

  .thumbnail {
    border-radius: ${(props) => props.theme.borderRadius};
    width: 100%;
    object-position: center;
    object-fit: cover;
  }
`

const Item = ({ item }: { item: AnimationItem }) => {
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

const Collection = () => {
  return (
    <>
      {meta.map((collection) => {
        return (
          <Card key={collection.name}>
            {collection.name}
            <ItemWrapper>
              {collection.item.map((item) => (
                <Item item={item} key={item.id}></Item>
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
