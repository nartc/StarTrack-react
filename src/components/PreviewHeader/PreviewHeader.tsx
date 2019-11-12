import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LazyImg } from '../LazyImg/LazyImg';
import { formatArtwork } from '../../pipes/formatArtworkUrl/formatArtworkUrl';
import { play, more, shuffle } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/react';
import './PreviewHeader.css';
export function PreviewHeader({ album }: { album: any }) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    collection: null,
    duration: null
  });
  useEffect(
    () => {
      if (Object.keys(album).length !== 0) {
        let duration = 0;
        for (const song of album.relationships.tracks.data) {
          if (song.attributes.durationInMillis) {
            duration += song.attributes.durationInMillis;
          }
        }
        setState({ collection: album, duration });
      }
    },
    [album]
  );

  const playAlbum = (shouldShuffle: boolean) => {
    dispatch({ type: 'playAlbum', payload: {collection: state.collection, shouldShuffle} })
  }

  const formatDuration = (val: number) => {
    const { hours, minutes } = (window as any).MusicKit.formattedMilliseconds( val);
    const hourTime = hours === 0 ? `` : `${hours} hours, `;
    const minutesTime = `${minutes} minutes`;
    return `${hourTime} ${minutesTime} `;
  };

  return (
    <div
      className="preview-header"
      style={{
        backgroundImage: `url("${(window as any).MusicKit.formatArtworkURL(
          {
            url: state.collection ? state.collection.attributes.artwork.url : ''
          },
          1000,
          1000
        )}")`
      }}
    >
      <div className="artwork-header">
        <div className="album-info">
          {state.collection ? (
            <>
              <LazyImg
                className="header-artwork"
                lazySrc={formatArtwork(
                  state.collection.attributes.artwork.url,
                  1500
                )}
                alt="Album Art "
              />
              <div className="album-detail">
                <h3>{state.collection.attributes.name}</h3>
                <p>
                  {state.collection.attributes.artistName
                    ? state.collection.attributes.artistName
                    : state.collection.attributes.curatorName}
                </p>
                <p>
                  {state.collection.attributes.description
                    ? state.collection.attributes.description.short
                    : state.collection.attributes.genreNames[0]}
                </p>
                <p>
                  {state.collection.relationships.tracks.data.length} Songs,{' '}
                  {formatDuration(state.duration)}
                </p>
                <IonButton fill="outline" onClick={() => playAlbum(false)}>
                  <IonIcon slot="start" icon={play} />
                  Play
                </IonButton>
                <IonButton fill="outline" onClick={() => playAlbum(false)}>
                  <IonIcon icon={shuffle} slot="start" />
                  Shuffle
                </IonButton>
                <IonButton fill="outline">
                  <IonIcon icon={more} slot="icon-only" />
                </IonButton>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}